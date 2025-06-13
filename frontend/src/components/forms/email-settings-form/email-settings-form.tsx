import { zodResolver } from '@hookform/resolvers/zod';
import { Button, TextInput, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as zod from 'zod';

import styles from '~/components/forms/forms.module.css';
import _styles from '~/index.module.css';

import { REQUIRED_FIELD_TEXT } from '~/conts';
import { postAuthManageChangeEmail } from '~/generated-api/auth/auth';
import { useGetUsersMe } from '~/generated-api/users/users';
import { ErrorPage } from '~/pages/error-page';
import { LoadingPage } from '~/pages/loading-page';

const FormSchema = zod.object({
  email: zod
    .string()
    .nonempty(REQUIRED_FIELD_TEXT),
});

type IFormInput = zod.infer<typeof FormSchema>;

export const EmailSettingsForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { data: userMe, isLoading: isLoadingUserMe, isError: isErrorUserMe } = useGetUsersMe();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: zodResolver(FormSchema),
    reValidateMode: 'onChange',
    mode: 'onTouched',
  });

  const { mutateAsync: updateEmail } = useMutation({
    mutationFn: postAuthManageChangeEmail,
    onSuccess: () => {
      notifications.show({
        title: 'Ссылка для подтверждения отправлена на почту',
        message: undefined,
        color: 'var(--green-color)',
      });
    },
    onError: () => {
      notifications.show({
        title: 'Ошибка сохранения',
        message: undefined,
        color: 'var(--red-color)',
      });
    }
  });

  const onSubmit = async (data: IFormInput) => {
    setIsLoading(true);
    await updateEmail({
      newEmail: data.email,
    });
    setIsLoading(false);
  };

  if (isLoadingUserMe) {
    return <LoadingPage/>;
  }

  if (isErrorUserMe) {
    return <ErrorPage/>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`${styles.form}`}>
      <Text className={_styles.textGray}>Текущий адрес</Text>
      <Text>{userMe?.email}</Text>


      <TextInput
        label='Новая почта'
        placeholder='Введите новую почту'
        {...register('email')}
        error={errors?.email?.message}
      />
      <Button
        variant='filled'
        type='submit'
        fullWidth
        loading={isLoading}>
        Подтвердить почту
      </Button>
    </form>
  );
};