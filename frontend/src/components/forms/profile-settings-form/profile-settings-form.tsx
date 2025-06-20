import { zodResolver } from '@hookform/resolvers/zod';
import { Button, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as zod from 'zod';

import styles from '~/components/forms/forms.module.css';

import { FileButton } from '~/components/custom-mantine';
import { ProfileFormSchema } from '~/conts';
import { getGetUsersMeQueryKey, postUsersEditProfile, useGetUsersMe } from '~/generated-api/users/users';
import { LoadingPage } from '~/pages/loading-page';
import { queryClient } from '~/services/query-client';

type IFormInput = zod.infer<typeof ProfileFormSchema>;

export const ProfileSettingsForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { data, isLoading: isLoadingData } = useGetUsersMe();

  const {
    setValue,
    register,
    reset,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: zodResolver(ProfileFormSchema),
    reValidateMode: 'onChange',
    mode: 'onTouched'
  });

  React.useEffect(() => {
    if (data) {
      reset({
        firstName: data.firstName ?? '',
        lastName: data.lastName ?? '',
        username: data.username ?? '',
        contactUrl: data.contactUrl ?? ''
      });
    }
  }, [data, reset]);

  const { mutateAsync: updateProfile } = useMutation({
    mutationFn: postUsersEditProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetUsersMeQueryKey() }).then();

      notifications.show({
        title: 'Профиль обновлен',
        message: undefined,
        color: 'var(--green-color)',
      });
    },

    onError: (error: AxiosError<{
      problemDetails: {
        errors: {
          UsernameAlreadyTakenError?: string[];
        }
      }
    }>) => {
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData.problemDetails.errors) {
          const errorMessage = (errorData.problemDetails.errors.UsernameAlreadyTakenError?.[0]
            && 'Никнейм уже занят') || undefined;

          notifications.show({
            title: 'Ошибка сохранения',
            message: errorMessage,
            color: 'var(--red-color)',
          });
        }
      }
    }
  });

  const onSubmit = async (data: IFormInput) => {
    try {
      setIsLoading(true);
      await updateProfile({
        FirstName: data.firstName,
        LastName: data.lastName,
        ContactUrl: data.contactUrl,
        Username: data.username,
        PhotoFile: data.profilePhoto,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return <LoadingPage/>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`${styles.form} ${styles.formCenter}`}>
      <FileButton
        name='profilePhoto'
        type='avatar'
        error={errors?.profilePhoto?.message}
        setValue={setValue}
        setError={setError}
        clearErrors={clearErrors}
        photoUrl={data?.photoUrl}
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
        loading={isLoading}>
        Сохранить
      </Button>

    </form>
  );
};
