import { zodResolver } from '@hookform/resolvers/zod';
import { Button, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as zod from 'zod';

import styles from '~/components/forms/forms.module.css';

import { checkProfileFilling } from '~/actions/user-actions';
import { FileButton } from '~/components/custom-mantine';
import { ProfileFormSchema } from '~/conts';
import { postUsersEditProfile } from '~/generated-api/users/users';

type IFormInput = zod.infer<typeof ProfileFormSchema>;

export const ProfileFillingForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    setValue,
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: zodResolver(ProfileFormSchema),
    reValidateMode: 'onChange',
    mode: 'onTouched',
  });

  const { mutateAsync: fillProfile } = useMutation({
    mutationFn: postUsersEditProfile,
    onError: (error: AxiosError<{
      problemDetails: {
        errors: {
          UsernameAlreadyTakenError?: string[];
        }
      }
    }>) => {
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData.problemDetails?.errors) {
          const errorMessage = (errorData.problemDetails.errors.UsernameAlreadyTakenError?.[0] && 'Имя пользователя уже занято') ||
            undefined;

          notifications.show({
            title: 'Ошибка заполнения профиля',
            message: errorMessage,
            color: 'var(--red-color)',
          });
        }
      }
    },
    onSuccess: async (userData) => {
      await checkProfileFilling(userData, true);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`${styles.form} ${styles.formCenter}`}>
      <FileButton
        name='profilePhoto'
        type='avatar'
        error={errors?.profilePhoto?.message}
        setValue={setValue}
        setError={setError}
        clearErrors={clearErrors}
        validateFile={(file) => {
          const result = ProfileFormSchema.shape.profilePhoto.safeParse(file);
          return result.success;
        }}
      />

      <TextInput
        label='Имя'
        placeholder='Введите имя'
        {...register('firstName')}
        error={errors?.firstName?.message}
      />

      <TextInput
        label='Фамилия'
        placeholder='Введите фамилию'
        {...register('lastName')}
        error={errors?.lastName?.message}
      />

      <TextInput
        label='Никнейм'
        placeholder='Введите никнейм'
        {...register('username')}
        error={errors?.username?.message}
      />

      <TextInput
        label='Ссылка для связи'
        placeholder='Введите ссылку для связи'
        {...register('contactUrl')}
        error={errors?.contactUrl?.message}
      />

      <Button
        variant='filled'
        type='submit'
        fullWidth
        loading={isLoading}
      >
        Создать профиль
      </Button>

    </form>
  );
};
