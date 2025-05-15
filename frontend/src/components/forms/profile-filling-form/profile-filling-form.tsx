import { zodResolver } from '@hookform/resolvers/zod';
import { BackgroundImage, Button, Center, FileButton, Overlay, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { TechCamPhotoIcon24Regular, ToolPencilSquareIcon24Regular } from '@skbkontur/icons';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as zod from 'zod';

import styles from '~/components/forms/profile-filling-form/profile-filling-form.module.css';
import _styles from '~/index.module.css';

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
    .url('Ссылка должна быть валидной'),
  profilePhoto: zod
    .custom<File>()
    .refine((file) => file.size > 0, 'Файл не может быть пустым')
    .refine((file) => file.type === 'image/jpeg', 'Файл должен быть изображением')
    .refine((file) => file.size < 1024 * 1024, 'Файл не может быть больше 1MB'),
});

type IFormInput = zod.infer<typeof FormSchema>;

export const ProfileFillingForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

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
  });


  const onSubmit = async (data: IFormInput) => {
    try {
      setIsLoading(true);
      await fillProfile({
        FirstName: data.firstName,
        LastName: data.lastName,
        ContactUrl: data.contactUrl,
        PhotoFile: data.profilePhoto,
        Username: data.username,
      });
    } catch (error) {
      notifications.show({
        title: 'Ошибка заполнения профиля',
        message: undefined,
        color: 'var(--red-color)',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`${_styles.form} ${_styles.formCenter}`}>
      <FileButton accept="image/jpeg" onChange={(file) => {
        setFile(file);
        if (file) setValue('profilePhoto', file);
      }}>
        {(props) => <Button {...props} className={`${styles.avatarButton} ${_styles.photoButton} ${file && _styles.photoButtonChosen}`}>
          {file ? 
            <BackgroundImage
              src={URL.createObjectURL(file)}
              className={_styles.photoButtonImage}
              style={{aspectRatio: 1}}>
              <Center h="100%">
                <ToolPencilSquareIcon24Regular color="var(--white-color)"/>
              </Center>
              <Overlay color="var(--light-gray-16-color)"/>
            </BackgroundImage> 
            : <TechCamPhotoIcon24Regular/>}
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
        loading={isLoading}
      >
        Создать профиль
      </Button>

    </form>
  );
};
