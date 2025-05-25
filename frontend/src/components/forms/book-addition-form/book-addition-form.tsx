import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Textarea, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as zod from 'zod';

import f_styles from '~/components/forms/forms.module.css';
import styles from '~/pages/book-page/book-page.module.css';

import { FileButton } from '~/components/custom-mantine';
import { AppRoute, REQUIRED_FIELD_TEXT } from '~/conts';
import { postBooksAdd } from '~/generated-api/books/books';
import { router } from '~/main';

const FormSchema = zod.object({
  title: zod
    .string()
    .nonempty(REQUIRED_FIELD_TEXT),
  description: zod
    .string()
    .nonempty(REQUIRED_FIELD_TEXT),
  author: zod
    .string()
    .nonempty(REQUIRED_FIELD_TEXT),
  language: zod
    .string()
    .nonempty(REQUIRED_FIELD_TEXT),
  year: zod
    .coerce.number()
    .gte(1900, 'Год должен быть более поздний')
    .lte(new Date().getFullYear(), 'Год не может быть в будущем'),
  isbn: zod
    .string()
    .nonempty(REQUIRED_FIELD_TEXT),
  bookCover: zod
    .custom<File>((data) => {
      if (data instanceof File) {
        return true;
      }
      return false;
    }, 'Фото не может быть пустым')
});

type IFormInput = zod.infer<typeof FormSchema>;

export const BookAdditionForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    clearErrors,
  } = useForm<IFormInput>({
    resolver: zodResolver(FormSchema),
    reValidateMode: 'onChange',
    mode: 'onTouched',
  });

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstErrorElement = document.querySelector('[data-error]');
      if (firstErrorElement) {
        console.log(firstErrorElement);
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [errors]);

  const { mutateAsync: addBook } = useMutation({
    mutationFn: postBooksAdd,
    onError: (error: AxiosError<{
      errors: {
        ModelValidationError?: string[];
      }
    }>) => {
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData.errors) {
          const errorMessage = (errorData.errors.ModelValidationError?.[0] ? 'ISBN неправильного формата' : '') || 
                             'Произошла ошибка при добавлении книги';
          
          notifications.show({
            title: errorMessage,
            message: undefined,
            color: 'var(--red-color)',
          });
        }
      }
    },
    onSuccess: async (bookData) => {
      router.navigate(AppRoute.Book.replace(':id', bookData.id!));
    },
  });

  const onSubmit = async (data: IFormInput) => {
    try {
      setIsLoading(true);
      await addBook({
        Title: data.title,
        Author: data.author,
        Description: data.description,
        BookCover: data.bookCover,
        Language: data.language,
        PublicationYear: data.year,
        Isbn: data.isbn,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`${f_styles.form} ${f_styles.bookAddForm}`}>
      <div className={styles.bookCover}>
        <FileButton 
          name="bookCover" 
          type="book" 
          error={errors?.bookCover?.message}
          setValue={setValue}
          setError={setError}
          clearErrors={clearErrors}
          validateFile={(file) => {
            const result = FormSchema.shape.bookCover.safeParse(file);
            return result.success;
          }}
          data-error={errors?.bookCover?.message ? true : undefined}
        />
        <div className={styles.roundRect} />
      </div>
      <div className={`${styles.bookContent} ${f_styles.bookContentAddition}`}>
        <FileButton 
          name="bookCover" 
          type="book"
          className={f_styles.desktopFileButton}
          error={errors?.bookCover?.message}
          setValue={setValue}
          setError={setError}
          clearErrors={clearErrors}
          validateFile={(file) => {
            const result = FormSchema.shape.bookCover.safeParse(file);
            return result.success;
          }}
          data-error={errors?.bookCover?.message ? true : undefined}
        />

        <div className={styles.actions}>
          <TextInput
            label="Название"
            placeholder="Введите название книги"
            {...register('title')}
            error={errors?.title?.message}
            data-error={errors?.title?.message ? true : undefined}
          />

          <Textarea
            label="Описание"
            placeholder="Введите описание книги"
            {...register('description')}
            error={errors?.description?.message}
            autosize
            minRows={2}
            data-error={errors?.description?.message ? true : undefined}
          />

          <TextInput
            label="Автор"
            placeholder="Введите автора книги"
            {...register('author')}
            error={errors?.author?.message}
            data-error={errors?.author?.message ? true : undefined}
          />

          <TextInput
            label="Год"
            placeholder="Введите год написания книги"
            {...register('year')}
            error={errors?.year?.message}
            type="number"
            data-error={errors?.year?.message ? true : undefined}
          />

          <TextInput
            label="Isbn"
            placeholder="Введите ISBN книги"
            {...register('isbn')}
            error={errors?.isbn?.message}
            data-error={errors?.isbn?.message ? true : undefined}
          />
          <TextInput
            label="Язык"
            placeholder="Введите язык книги"
            {...register('language')}
            error={errors?.language?.message}
            data-error={errors?.language?.message ? true : undefined}
          />

          <Button
            variant="filled"
            onClick={handleSubmit(onSubmit)}
            loading={isLoading}
            fullWidth>
          Добавить книгу
          </Button>
        </div>
      </div>
    </form>
  );
};
