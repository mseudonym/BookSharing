import { Button, Flex, Text } from '@mantine/core';
import jsQR from 'jsqr';
import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';

export const ISBNScanner = () => {
  const webcamRef = useRef<Webcam>(null);
  const [isbn, setIsbn] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(true);

  // Настройки камеры
  const videoConstraints = {
    facingMode: 'environment',
  };

  // Функция для обработки изображения с камеры
  const scanBarcode = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        setError('Не удалось получить изображение с камеры. Проверьте доступ к камере.');
        return;
      }

      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, img.width, img.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);

          if (code) {
            setIsbn(code.data);
            setError(null);
            setIsScanning(false); // Останавливаем сканирование при успехе
          } else {
            setError('Штрихкод не распознан. Наведите камеру на штрихкод и убедитесь, что он в фокусе.');
          }
        } else {
          setError('Не удалось обработать изображение. Попробуйте снова.');
        }
      };
    }
  };

  // Запускаем сканирование, если isScanning === true
  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(scanBarcode, 500);
      return () => clearInterval(interval);
    }
  }, [isScanning]);

  // Обработчик для кнопки повторного сканирования
  const handleRetry = () => {
    setIsbn(null);
    setError(null);
    setIsScanning(true);
  };

  return (
    <>
      {isScanning && (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            style={{ width: '100%', maxWidth: '640px', border: '2px solid #ccc', borderRadius: '32px' }}
          />
          <Text>
            Наведите камеру на штрихкод ISBN. Убедитесь, что изображение четкое и хорошо освещено.
          </Text>
        </>
      )}
      {isbn && (
        <Flex direction='column' gap='md'>
          <Text span>Распознанный ISBN:</Text>
          <Text>{isbn}</Text>
          <Button onClick={handleRetry} variant='filled'>Сканировать снова</Button>
        </Flex>
      )}
      {error && (
        <Flex direction='column' gap='md'>
          <Text style={{ color: 'var(--red-color)' }}>{error}</Text>
          <Button onClick={handleRetry} variant='filled'>Попробовать снова</Button>
        </Flex>
      )}
    </>
  );
};