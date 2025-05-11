import _styles from '../../index.module.css';
import styles from '/src/pages/book-page/book-page.module.css';
import * as zod from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { postBooksAdd } from '../../generated-api/books/books';
import { InputCover } from '../inputs/input-cover/input-cover';
import { InputField } from '../inputs/input-field/input-field';
import { Button } from '@mantine/core';
import { AppRoute, REQUIRED_FIELD_TEXT } from '../../conts';
import { router } from '../../main';

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
  bookCover: zod
    .any()
    .refine((file) => file.type == 'image/jpg'),
});

type IFormInput = zod.infer<typeof FormSchema>;

export const BookAdditionForm = () => {
  const {
    watch,
    setValue,
    register,
    handleSubmit,
    formState: { errors, isValid },
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
    await addBook({
      Title: data.title,
      Author: data.author,
      Description: data.description,
      BookCover: data.bookCover,
      Language: data.language,
      PublicationYear: data.year,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.wrapper}>
        <div className={styles.bookWrapper}>
          <InputCover
            coverFile={watch('bookCover')}
            onCoverFileChange={(photoFile: File) => setValue('bookCover', photoFile)}
            register={register('bookCover')}
            // error={errors?.bookCover?.message}
          />
          <div className={_styles.roundRect} />
        </div>
        <div className={_styles.content}>
          <div className={styles.bookInfo2}>
            <InputField
              label="Название"
              placeholder="Введите название книги"
              register={register('title')}
              error={errors?.title?.message}
            />

            <InputField
              label="Описание"
              placeholder="Введите описание книги"
              register={register('description')}
              error={errors?.description?.message}
            />

            <InputField
              label="Автор"
              placeholder="Введите автора книги"
              register={register('author')}
              error={errors?.author?.message}
            />

            <InputField
              label="Год"
              placeholder="Введите год написания книги"
              register={register('year')}
              error={errors?.year?.message}
              type="number"
            />

            <InputField
              label="Язык"
              placeholder="Введите язык книги"
              register={register('language')}
              error={errors?.language?.message}
            />

            <Button
              variant="primary"
              onClick={handleSubmit(onSubmit)}
              disabled={!isValid}
            >
              Добавить книгу
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};
