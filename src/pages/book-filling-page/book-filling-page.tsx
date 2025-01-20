import _styles from '../../index.module.css'
import styles from '../book-page/book-page.module.css';
import { ArrowALeftIcon24Regular } from '@skbkontur/icons';
import { Header } from '../../components/header/header';
import { PageBackground } from '../../ui/page/page-background';
import { ButtonIcon } from '../../components/button-icon/button-icon';
import { InputCover } from '../../components/inputs/input-cover/input-cover';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from "zod";
import { useMutation } from '@tanstack/react-query';
import { postBooksAdd } from '../../generated-api/books/books';
import { useNavigate } from 'react-router';
import { InputField } from '../../components/inputs/input-field/input-field';

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
    .number(),
  bookCover: zod
    .custom<File>(),
});

type IFormInput = zod.infer<typeof FormSchema>;

export const BookFillingPage = () => {
  const {
    watch,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
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
      PublicationYear: data.year,
    });
  };

  return (
    <PageBackground>
      <Header variant='left'>
        <ButtonIcon variant='flat' onClick={() => { window.history.back() }}>
          <ArrowALeftIcon24Regular />
        </ButtonIcon>
      </Header>

      <form onSubmit={handleSubmit(onSubmit)}>
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
            <InputField
              label={"Название"}
              placeholder={"Введите имя"}
              register={register("title")}
              error={errors?.title?.message}
            />
          </div>
        </div>
      </form>
    </PageBackground>
  );
}