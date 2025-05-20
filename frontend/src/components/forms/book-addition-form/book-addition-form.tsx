import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Textarea, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
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
    .custom<File>()
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

  const { mutateAsync: addBook } = useMutation({
    mutationFn: postBooksAdd,
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
    } catch (error) {
      notifications.show({
        title: 'Ошибка добавления книги',
        message: undefined,
        color: 'var(--red-color)',
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
        />

        <div className={styles.actions}>
          <TextInput
            label="Название"
            placeholder="Введите название книги"
            {...register('title')}
            error={errors?.title?.message}
          />

          <Textarea
            label="Описание"
            placeholder="Введите описание книги"
            {...register('description')}
            error={errors?.description?.message}
            autosize
            minRows={2}
          />

          <TextInput
            label="Автор"
            placeholder="Введите автора книги"
            {...register('author')}
            error={errors?.author?.message}
          />

          <TextInput
            label="Год"
            placeholder="Введите год написания книги"
            {...register('year')}
            error={errors?.year?.message}
            type="number"
          />

          <TextInput
            label="Isbn"
            placeholder="Введите ISBN книги"
            {...register('isbn')}
            error={errors?.isbn?.message}
          />
          <TextInput
            label="Язык"
            placeholder="Введите язык книги"
            {...register('language')}
            error={errors?.language?.message}
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
