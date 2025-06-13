import { Button, BackgroundImage, Center, Overlay, FileButton as MantineFileButton, Text, Flex } from '@mantine/core';
import { ToolPencilSquareIcon24Regular, TechCamPhotoIcon24Regular } from '@skbkontur/icons';
import React, { useState } from 'react';
import {
  UseFormClearErrors,
  UseFormSetError,
  UseFormSetValue,
  FieldValues,
  Path,
  PathValue,
  FieldError,
  FieldErrorsImpl,
  Merge
} from 'react-hook-form';

import styles from '~/components/custom-mantine/file-button/file-button.module.css';

type FileButtonProps<T extends FieldValues> = {
    name: Path<T>;
    type: 'avatar' | 'book';
    setError?: UseFormSetError<T>;
    setValue: UseFormSetValue<T>;
    clearErrors?: UseFormClearErrors<T>;
    photoUrl?: string | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error?: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
    accept?: string;
    aspectRatio?: number;
    validateFile?: (file: File) => boolean;
    className?: string;
}

export const FileButton = <T extends FieldValues>({
  name,
  type,
  setError,
  setValue,
  clearErrors,
  photoUrl = null,
  error,
  accept = 'image/jpeg',
  aspectRatio = type === 'avatar' ? 1 : 0.7,
  validateFile,
  className
}: FileButtonProps<T>) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (file: File | null) => {
    setFile(file);

    if (!file) {
      clearErrors?.(name);
      return;
    }

    if (validateFile && !validateFile(file)) {
      setError?.(name, {
        type: 'manual',
        message: typeof error === 'string' ? error : (error as { message: string }).message
      });
      return;
    }

    clearErrors?.(name);
    setValue(name, file as PathValue<T, Path<T>>);
  };

  return (
    <Flex gap='sm' className={`${className} ${styles.fileButtonWrapper}`} direction='column' align='center'>
      <MantineFileButton accept={accept} onChange={handleFileChange}>
        {(props) => (
          <Button
            {...props}
            className={`${styles[type]} ${styles.photoButton} ${(photoUrl || file) && styles.photoButtonChosen}`}
          >
            {file ?
              <BackgroundImage
                src={URL.createObjectURL(file)}
                className={styles.photoButtonImage}
                style={{ aspectRatio }}>
                <Center h='100%'>
                  <ToolPencilSquareIcon24Regular color='var(--white-color)'/>
                </Center>
                <Overlay/>
              </BackgroundImage>
              : photoUrl ?
                <BackgroundImage
                  src={photoUrl}
                  className={styles.photoButtonImage}
                  style={{ aspectRatio }}>
                  <Center h='100%'>
                    <ToolPencilSquareIcon24Regular color='var(--white-color)'/>
                  </Center>
                  <Overlay/>
                </BackgroundImage>
                : <TechCamPhotoIcon24Regular/>}
          </Button>
        )}
      </MantineFileButton>
      {error && (
        <Text span ta='center' c='var(--red-color)' className={styles.errorText}>
          {typeof error === 'string' ? error : (error as { message: string }).message}
        </Text>
      )}
    </Flex>
  );
};