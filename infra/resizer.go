package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"image"
	"image/jpeg"
	"image/png"
	"io"
	"net/http"
	"os"
	"path"
	"strconv"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	"go.uber.org/zap"
	"golang.org/x/image/draw"
)

const ycSdkEndpoint = "https://storage.yandexcloud.net"

type TracingContext struct {
	TraceId      string `json:"trace_id"`
	SpanId       string `json:"span_id"`
	ParentSpanId string `json:"parent_span_id"`
}

type EventMetadata struct {
	EventID        string         `json:"event_id"`
	EventType      string         `json:"event_type"`
	CreatedAt      time.Time      `json:"created_at"`
	TracingContext TracingContext `json:"tracing_context"`
	CloudID        string         `json:"cloud_id"`
	FolderID       string         `json:"folder_id"`
}

type ObjectStorageDetails struct {
	BucketId string `json:"bucket_id"`
	ObjectId string `json:"object_id"`
}

type ObjectStorageMessage struct {
	EventMetadata EventMetadata        `json:"event_metadata"`
	Details       ObjectStorageDetails `json:"details"`
}

type ObjectStorageEvent struct {
	Messages []ObjectStorageMessage `json:"messages"`
}

type Response struct {
	StatusCode int         `json:"statusCode"`
	Body       interface{} `json:"body"`
}

type Resolution struct {
	Width  int
}

func (r Resolution) String() string {
	return fmt.Sprintf("%dx%d", r.Width)
}

type EmptyCredentialsProvider struct{}

func (p *EmptyCredentialsProvider) Retrieve() (credentials.Value, error) {
	return credentials.Value{}, nil
}

func (p *EmptyCredentialsProvider) IsExpired() bool {
	return false
}

type AuthTransport struct {
	roundTripper http.RoundTripper
	token        string
}

func NewTransport(t http.RoundTripper, token string) *AuthTransport {
	return &AuthTransport{roundTripper: t, token: token}
}

func (t *AuthTransport) RoundTrip(r *http.Request) (*http.Response, error) {
	r.Header.Set("X-YaCloud-SubjectToken", t.token)
	return t.roundTripper.RoundTrip(r)
}

type IAMToken struct {
	AccessToken string `json:"access_token"`
	ExpiresIn   int    `json:"expires_in"`
	TokenType   string `json:"token_type"`
}

func Handler(ctx context.Context, event ObjectStorageEvent) (*Response, error) {
	logger := newLogger(ctx)
	srcDir := path.Clean(os.Getenv("SOURCE_DIR")) + "/"
	lowQualityDstDir := os.Getenv("LOW_RESIZED_DIR")
	lowQualityWidthStr := os.Getenv("LOW_RESIZED_WIDTH")
	highQualityDstDir := os.Getenv("HIGH_RESIZED_DIR")
	highQualityWidthStr := os.Getenv("HIGH_RESIZED_WIDTH")
	endpoint := os.Getenv("ENDPOINT")
	if endpoint == "_" {
		endpoint = ycSdkEndpoint
	}

	lowResolution, err := parseResolution(lowQualityWidthStr)
	if err != nil {
		return nil, err
	}
	highResolution, err := parseResolution(highQualityWidthStr)
	if err != nil {
		return nil, err
	}
	logger.Debug("Got event", zap.Any("event", event))

	sess, err := awsSession(ctx, endpoint)
	if err != nil {
		return nil, err
	}
	for _, message := range event.Messages {
		if !strings.HasPrefix(message.Details.ObjectId, srcDir) {
			logger.Info("Skipping object, as it not in source dir",
				zap.String("object_id", message.Details.ObjectId),
				zap.String("source_dir", srcDir))
			continue
		}
		output, err := s3.New(sess).HeadObject(&s3.HeadObjectInput{
			Bucket: aws.String(message.Details.BucketId),
			Key:    aws.String(message.Details.ObjectId),
		})
		if err != nil {
			return nil, err
		}
		contentType := ""
		if output.ContentType != nil {
			contentType = *output.ContentType
		}
		if contentType != "image/jpeg" && contentType != "image/png" {
			logger.Info("Skipping unsupported content type",
				zap.String("object_id", message.Details.ObjectId),
				zap.String("content_type", contentType))
			continue
		}
		logger.Debug("Got input object", zap.Any("object-metadata", output))
		err = processMessage(ctx, logger, message, lowResolution, sess, nameFunc(srcDir, lowQualityDstDir))
		if err != nil {
			return nil, err
		}
		err = processMessage(ctx, logger, message, highResolution, sess, nameFunc(srcDir, highQualityDstDir))
		if err != nil {
			return nil, err
		}
	}
	return &Response{
		StatusCode: http.StatusOK,
		Body:       []byte(nil),
	}, nil
}

func newLogger(ctx context.Context) *zap.Logger {
	encConfig := zap.NewProductionEncoderConfig()
	encConfig.MessageKey = "message"
	cfg := zap.NewProductionConfig()
	cfg.EncoderConfig = encConfig
	reqID, ok := ctx.Value("lambdaRuntimeRequestID").(string)
	logger := zap.Must(cfg.Build())
	if ok {
		logger = logger.With(zap.String("request_id", reqID))
	}
	return logger
}

func awsSession(ctx context.Context, endpoint string) (*session.Session, error) {
	iamTokenJSON := ctx.Value("lambdaRuntimeTokenJSON").(string)
	resp := &IAMToken{}
	err := json.Unmarshal([]byte(iamTokenJSON), resp)
	if err != nil {
		return nil, err
	}
	transport := NewTransport(http.DefaultTransport, resp.AccessToken)

	sess := session.Must(session.NewSessionWithOptions(session.Options{
		Config: aws.Config{
			Endpoint:    aws.String(endpoint),
			Region:      aws.String("ru-central1"),
			Credentials: credentials.NewCredentials(&EmptyCredentialsProvider{}),
			HTTPClient: &http.Client{
				Transport: transport,
			},
		},
	}))
	return sess, nil
}

func nameFunc(srcDir, dstDir string) func(string) string {
	return func(name string) string {
		return path.Join(dstDir, strings.TrimPrefix(name, srcDir))
	}
}

func processMessage(ctx context.Context,
	logger *zap.Logger,
	message ObjectStorageMessage,
	resolution Resolution,
	sess *session.Session,
	nameFunc func(string) string,
) error {
	inputBuf := aws.NewWriteAtBuffer(nil)
	_, err := s3manager.NewDownloader(sess).DownloadWithContext(ctx, inputBuf, &s3.GetObjectInput{
		Bucket: aws.String(message.Details.BucketId),
		Key:    aws.String(message.Details.ObjectId),
	})
	if err != nil {
		return fmt.Errorf("failed to download object %s: %w", message.Details.ObjectId, err)
	}
	outputBuf, err := resizeImage(inputBuf.Bytes(), resolution)
	if err != nil {
		return fmt.Errorf("failed to resize image: %w", err)
	}

	newName := nameFunc(message.Details.ObjectId)
	logger.Debug("Uploading resized image",
		zap.String("new_name", newName),
		zap.Stringer("resolution", resolution))
	_, err = s3manager.NewUploader(sess).UploadWithContext(ctx, &s3manager.UploadInput{
		Body:   outputBuf,
		Bucket: aws.String(message.Details.BucketId),
		Key:    aws.String(newName),
	})
	if err != nil {
		return fmt.Errorf("failed to upload resized image: %w", err)
	}
	return nil
}

func resizeImage(input []byte, resolution Resolution) (io.Reader, error) {
	img, format, err := image.Decode(bytes.NewReader(input))
	if err != nil {
		return nil, fmt.Errorf("failed to decode image: %w", err)
	}

	srcBounds := img.Bounds()
	srcWidth := srcBounds.Dx()
	srcHeight := srcBounds.Dy()

	// Рассчитываем коэффициенты масштабирования по ширине
	scale := float64(resolution.Width) / float64(srcWidth)

	// Вычисляем новые размеры
	newWidth := int(float64(srcWidth) * scale)
	newHeight := int(float64(srcHeight) * scale)

	dstImg := image.NewRGBA(image.Rect(0, 0, newWidth, newHeight))
	draw.BiLinear.Scale(dstImg, dstImg.Bounds(), img, srcBounds, draw.Over, nil)

	outputBuf := &bytes.Buffer{}

	switch format {
	case "jpeg":
		err = jpeg.Encode(outputBuf, dstImg, nil)
	case "png":
		err = png.Encode(outputBuf, dstImg)
	default:
		return nil, fmt.Errorf("unsupported image format: %s", format)
	}
	if err != nil {
		return nil, err
	}
	return outputBuf, nil
}


func parseResolution(widthStr string) (Resolution, error) {
	width, err := strconv.Atoi(widthStr)
	if err != nil {
		return Resolution{}, fmt.Errorf("invalid width: %w", err)
	}
	if width < 0 {
		return Resolution{}, fmt.Errorf("invalid width: %v", width)
	}
	return Resolution{
		Width:  width,
	}, nil
}
