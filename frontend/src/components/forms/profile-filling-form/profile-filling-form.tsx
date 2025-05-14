import { zodResolver } from '@hookform/resolvers/zod';
import { Button, FileButton, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { TechCamPhotoIcon24Regular } from '@skbkontur/icons';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as zod from 'zod';

import styles from '~/components/forms/forms.module.css';

import { checkProfileFilling } from '~/actions/user-actions';
import { REQUIRED_FIELD_TEXT } from '~/conts';
import { postUsersEditProfile } from '~/generated-api/users/users';

const FormSchema = zod.object({
  firstName: zod
    .string()
    .nonempty(REQUIRED_FIELD_TEXT),
  lastName: zod
    .string()
    .nonempty(REQUIRED_FIELD_TEXT),
  username: zod
    .string()
    .nonempty(REQUIRED_FIELD_TEXT)
    .min(5, 'Никнейм не может быть короче 5-ти символов')
    .max(20, 'Никнейм не может быть длиннее 20-ти символов')
    .regex(/^[a-zA-Z0-9_]+$/, 'Никнейм может содержать только латинские буквы, цифры и нижние подчёркивания'),
  contactUrl: zod
    .string()
    .url(),
  profilePhoto: zod
    .custom<File>()
    .refine((file) => file.size > 0, 'Файл не может быть пустым')
    .refine((file) => file.type === 'image/jpeg', 'Файл должен быть изображением')
    .refine((file) => file.size < 1024 * 1024, 'Файл не может быть больше 1MB'),
});

type IFormInput = zod.infer<typeof FormSchema>;

export const ProfileFillingForm = () => {
  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: zodResolver(FormSchema),
    reValidateMode: 'onChange',
    mode: 'onTouched',
  });

  const { mutateAsync: fillProfile } = useMutation({
    mutationFn: postUsersEditProfile,
    onSuccess: async (userData) => {
      await checkProfileFilling(userData);
    },
    onError: (error: AxiosError<{
      errors: {
        DuplicateUserName?: string[];
      }
    }>) => {
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData.errors) {
          const errorMessage = (errorData.errors.DuplicateUserName?.[0] ? 'Имя пользователя уже занято' : '') || 
                             'Произошла ошибка при регистрации';
          
          notifications.show({
            title: 'Ошибка регистрации',
            message: errorMessage,
            color: 'var(--red-color)',
          });
        }
      }
    },
  });

  const onSubmit = async (data: IFormInput) => {
    try {
      await fillProfile({
        FirstName: data.firstName,
        LastName: data.lastName,
        ContactUrl: data.contactUrl,
        PhotoFile: data.profilePhoto,
        Username: data.username,
      });
    } catch (error) {
      //
    }
  };

  const [file, setFile] = useState<File | null>(null);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <FileButton accept="image/jpeg" onChange={(file) => {
        setFile(file);
        if (file) setValue('profilePhoto', file);
      }}>
        {(props) => <Button {...props} className={styles.photoButton}>
          {file ? 
            <img
              src={URL.createObjectURL(file)}
              alt=""
              className={styles.imageCover}
            /> : <TechCamPhotoIcon24Regular/>}
        </Button>}
      </FileButton>

      <TextInput
        label="Имя"
        placeholder="Введите имя"
        {...register('firstName')}
        error={errors?.firstName?.message}
      />

      <TextInput
        label="Фамилия"
        placeholder="Введите фамилию"
        {...register('lastName')}
        error={errors?.lastName?.message}
      />

      <TextInput
        label="Никнейм"
        placeholder="Введите никнейм"
        {...register('username')}
        error={errors?.username?.message}
      />

      <TextInput
        label="Ссылка для связи"
        placeholder="Введите ссылку для связи"
        {...register('contactUrl')}
        error={errors?.contactUrl?.message}
      />

      <Button
        variant="filled"
        onClick={handleSubmit(onSubmit)}
        fullWidth
      >
        Создать профиль
      </Button>

    </form>
  );
};
