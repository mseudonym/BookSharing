import { zodResolver } from '@hookform/resolvers/zod';
import { Button, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as zod from 'zod';

import styles from '~/components/forms/forms.module.css';

import { FileButton } from '~/components/custom-mantine';
import { ProfileFormSchema } from '~/conts';
import { postUsersEditProfile, useGetUsersMe } from '~/generated-api/users/users';

type IFormInput = zod.infer<typeof ProfileFormSchema>;

export const ProfileSettingsForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { data } = useGetUsersMe();

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

  const { mutateAsync: updateProfile } = useMutation({
    mutationFn: postUsersEditProfile,
    onSuccess: () => {
      notifications.show({
        title: 'Профиль обновлен',
        message: undefined,
        color: 'var(--green-color)',
      });
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
        ...(data.profilePhoto && { PhotoFile: data.profilePhoto }),
      });
    } catch (error) {
      notifications.show({
        title: 'Ошибка сохранения',
        message: undefined,
        color: 'var(--red-color)',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`${styles.form} ${styles.formCenter}`}>
      <FileButton 
        name="profilePhoto" 
        type="avatar" 
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
        label="Имя"
        placeholder="Введите имя"
        {...register('firstName')}
        error={errors?.firstName?.message}
        defaultValue={data?.firstName ?? ''}
      />
  
      <TextInput
        label="Фамилия"
        placeholder="Введите фамилию"
        {...register('lastName')}
        error={errors?.lastName?.message}
        defaultValue={data?.lastName ?? ''}
      />
  
      <TextInput
        label="Никнейм"
        placeholder="Введите никнейм"
        {...register('username')}
        error={errors?.username?.message}
        defaultValue={data?.username ?? ''}
      />
  
      <TextInput
        label="Ссылка для связи"
        placeholder="Введите ссылку для связи"
        {...register('contactUrl')}
        error={errors?.contactUrl?.message}
        defaultValue={data?.contactUrl ?? ''}
      />
  
      <Button
        variant="filled"
        type="submit"
        fullWidth
        loading={isLoading} >
          Сохранить
      </Button>
  
    </form>
  );
};
