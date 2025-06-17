import Quagga from '@ericblade/quagga2';
import { Button, Flex, Image, Modal, Text, Title, SimpleGrid, Loader } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import ISBN from 'isbn3';
import React, { useRef, useState, useEffect, useMemo } from 'react';
import Webcam from 'react-webcam';

import styles from '~/components/isbn-scanner/isbn-scanner.module.css';

import { IllustrationWrapper } from '~/components/illustration-wrapper';
import { AppRoute } from '~/conts';
import { useGetBooksByIsbnIsbn } from '~/generated-api/books/books';
import { postItemsAddToMyShelf } from '~/generated-api/items/items';
import { router } from '~/main';

export const ISBNScanner = () => {
  const webcamRef = useRef<Webcam | null>(null);
  const [isbn, setIsbn] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const { data: bookData, isLoading, isError } = useGetBooksByIsbnIsbn(isbn, {
    query: { retry: false },
  });
  const [opened, { open, close }] = useDisclosure(false);

  const { mutateAsync: addBookToShelf } = useMutation({
    mutationFn: postItemsAddToMyShelf,
    onSuccess: async () => {
      notifications.show({
        title: 'Книга добавлена на полку',
        message: undefined,
        color: 'var(--green-color)',
      });
      close();
      handleRetry();
    },
    onError: (err) => {
      setError(`Ошибка добавления книги: ${err.message}`);
    },
  });

  const videoConstraints = useMemo(() => ({
    facingMode: 'environment',
    width: { ideal: 640 },
    height: { ideal: 480 },
  }), []);

  useEffect(() => {
    if (!isLoading && isbn && !isError && bookData) {
      open();
    } else {
      close();
    }
  }, [isLoading, isbn, isError, bookData, open, close]);

  useEffect(() => {
    let isMounted = true;
    const currentWebcam = webcamRef.current;

    const initializeQuagga = () => {
      if (!isMounted || !isScanning || !currentWebcam || !currentWebcam.video) {
        if (isMounted) {
          setError('Камера не инициализирована. Проверьте доступ к камере.');
          setIsScanning(false);
        }
        return;
      }

      Quagga.init(
        {
          inputStream: {
            name: 'Live',
            type: 'LiveStream',
            target: currentWebcam.video,
            constraints: videoConstraints,
          },
          decoder: {
            readers: ['ean_reader'],
          },
          locate: true,
        },
        (err) => {
          if (err || !isMounted) {
            if (isMounted) {
              setError(`Ошибка инициализации: ${err ? err.message : 'Неизвестная ошибка'}`);
              setIsScanning(false);
            }
            return;
          }
          Quagga.start();
        }
      );

      Quagga.onDetected((data) => {
        const code = data?.codeResult?.code;
        if (code && (code.startsWith('978') || code.startsWith('979'))) {
          const hyphenatedIsbn = ISBN.hyphenate(code);
          setIsbn(hyphenatedIsbn);
          setError(null);
          setIsScanning(false);
          Quagga.stop();
        } else {
          setError('Штрихкод не является ISBN. Попробуйте снова.');
        }
      });
    };

    const checkVideoReady = () => {
      if (currentWebcam && currentWebcam.video && currentWebcam.video.readyState >= 2) {
        initializeQuagga();
      } else {
        setTimeout(checkVideoReady, 500);
      }
    };

    if (isScanning) {
      checkVideoReady();
    }

    return () => {
      isMounted = false;
      Quagga.stop();
      Quagga.offDetected();
      if (currentWebcam && currentWebcam.video && currentWebcam.video.srcObject) {
        const stream = currentWebcam.video.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isScanning, videoConstraints]);

  const handleRetry = () => {
    setIsbn('');
    setError(null);
    setIsScanning(true);
    close();
    if (webcamRef.current && webcamRef.current.video) {
      const stream = webcamRef.current.video.srcObject as MediaStream | null;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      navigator.mediaDevices
        .getUserMedia({ video: videoConstraints })
        .then((newStream) => {
          if (webcamRef.current && webcamRef.current.video) {
            webcamRef.current.video.srcObject = newStream;
          }
        })
        .catch((err) => {
          setError(`Не удалось перезапустить камеру: ${err.message}`);
          setIsScanning(false);
        });
    }
  };

  const handleUserMediaError = (err: string | DOMException) => {
    const errorMessage = typeof err === 'string' ? err : err.message || 'Неизвестная ошибка';
    setError(`Ошибка доступа к камере: ${errorMessage}`);
    setIsScanning(false);
  };

  return (
    <>
      <Modal opened={opened} onClose={close} centered>
        <Flex direction='column' align='center' gap='md'>
          <Image className={styles.bookCover} src={bookData?.bookCoverUrl}/>
          <Title order={6}>{bookData?.title}</Title>
          <SimpleGrid
            cols={{ base: 1, sm: 2 }}
            spacing={{ base: 'md' }}
            verticalSpacing={{ base: 'md' }}
            style={{ width: '100%' }}
          >
            <Button
              variant='filled'
              onClick={() => addBookToShelf({ bookId: bookData?.id })}
            >
              Добавить книгу
            </Button>
            <Button variant='outline' onClick={close}>
              Не добавлять
            </Button>
          </SimpleGrid>
        </Flex>
      </Modal>

      {isLoading && <Loader/>}

      {!isLoading && (isScanning ? (
        <>
          <Text ta='center' style={{ maxWidth: '800px' }}>
            Наведите камеру на штрихкод ISBN. Убедитесь, что изображение четкое и хорошо освещено.
          </Text>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat='image/jpeg'
            videoConstraints={videoConstraints}
            onUserMediaError={handleUserMediaError}
            style={{ width: '100%', maxWidth: '640px', border: '2px solid #ccc', borderRadius: '32px' }}
          />
        </>
      ) : (
        <Flex direction='column' gap='md'>
          {isbn && !bookData && (
            <>
              <IllustrationWrapper
                src='/scan-error.svg'
                alt="Book isn't in database illustration"
              />
              <Text span>Книги в базе нет, но вы можете добавить её вручную.</Text>
            </>
          )}
          <Text span>Распознанный ISBN: {ISBN.hyphenate(isbn)}</Text>
          {error && <Text c='red'>{error}</Text>}
          <Button onClick={handleRetry} variant='filled'>
            Сканировать снова
          </Button>
          <Button onClick={() => router.navigate(AppRoute.AddBookManually)} variant='outline'>
            Добавить книгу вручную
          </Button>
        </Flex>
      ))}
    </>
  );
};