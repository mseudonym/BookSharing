import _styles from '../../index.module.css'
import styles from '/src/pages/book-page/book-page.module.css';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from "zod";
import { useMutation } from '@tanstack/react-query';
import { postBooksAdd } from '../../generated-api/books/books';
import { useNavigate } from 'react-router';
import { FC } from 'react';
import { InputCover } from '../../components/inputs/input-cover/input-cover';
import { InputField } from '../../components/inputs/input-field/input-field';
import { Button } from '../buttons/button';

const FormSchema = zod.object({
  title: zod
    .string()
    .nonempty("Обязательное поле"),
  description: zod
    .string()
    .nonempty("Обязательное поле"),
  author: zod
    .string()
    .nonempty("Обязательное поле"),
  language: zod
    .string()
    .nonempty("Обязательное поле"),
  year: zod
    .coerce.number(),
  bookCover: zod
    .custom<File>(),
});

type IFormInput = zod.infer<typeof FormSchema>;

export const BookAddForm: FC = () => {
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

  const navigate = useNavigate();

  const { mutateAsync: addBook } = useMutation({
    mutationFn: postBooksAdd,
    onSuccess: async (bookData) => {
      navigate(`/book/${bookData.id}`)
    }
  });

  const onSubmit = async (data: IFormInput) => {
    await addBook({
      Title: data.title,
      Author: data.author,
      Description: data.description,
      BookCover: data.bookCover,
      Language: data.language,
      PublicationYear: Number(data.year),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.wrapper}>
        <div className={styles.bookWrapper}>
          <InputCover
            coverFile={watch('bookCover')}
            onCoverFileChange={(photoFile: File) => setValue("bookCover", photoFile)}
            register={register("bookCover")}
            error={errors?.bookCover?.message} />
          <div className={_styles.roundRect} />
        </div>
        <div className={_styles.content}>
          <div className={styles.bookInfo2}>
            <InputField
              label={"Название"}
              placeholder={"Введите название книги"}
              register={register("title")}
              error={errors?.title?.message}
            />

            <InputField
              label={"Описание"}
              placeholder={"Введите описание книги"}
              register={register("description")}
              error={errors?.description?.message}
            />

            <InputField
              label={"Автор"}
              placeholder={"Введите автора книги"}
              register={register("author")}
              error={errors?.author?.message}
            />

            <InputField
              label={"Год"}
              placeholder={"Введите год написания книги"}
              register={register("year")}
              error={errors?.year?.message}
              type='number'
            />

            <InputField
              label={"Язык"}
              placeholder={"Введите язык, на котором написана книга"}
              register={register("language")}
              error={errors?.language?.message}
            />

            <Button
              variant={'primary'}
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
}