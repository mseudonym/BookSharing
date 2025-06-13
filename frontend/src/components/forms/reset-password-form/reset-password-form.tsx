import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router';
import * as zod from 'zod';

import styles from '~/components/forms/forms.module.css';

import { PasswordInput } from '~/components/custom-mantine';
import { PasswordBaseSchema } from '~/conts';
import { postAuthResetPassword } from '~/generated-api/auth/auth';

type IFormInput = zod.infer<typeof PasswordBaseSchema>;

export const ResetPasswordForm = () => {
  const [searchParams] = useSearchParams();
  
  const email = searchParams.get('email') ?? '';
  const resetCode = searchParams.get('code') ?? '';
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: zodResolver(PasswordBaseSchema),
    reValidateMode: 'onChange',
    mode: 'onTouched',
  });

  const { mutateAsync: resetPasswordMutation } = useMutation({
    mutationFn: postAuthResetPassword,
    onSuccess: async () => {
      notifications.show({
        title: 'Пароль обновлен',
        message: undefined,
        color: 'var(--green-color)',
      });
    },
    onError: () => {
      notifications.show({
        title: 'Ошибка обновления пароля',
        message: undefined,
        color: 'var(--red-color)',
      });
    }
  });

  const onSubmit = async (data: IFormInput) => {
    setIsLoading(true);
    await resetPasswordMutation({ newPassword: data.confirmPassword, email: email, resetCode: resetCode });
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`${styles.form} ${styles.formPadding}`}>
      <PasswordInput
        label='Новый пароль'
        placeholder='Введите новый пароль'
        {...register('password')}
        error={errors?.password?.message}
      />

      <PasswordInput
        label='Новый пароль ещё раз'
        placeholder='Введите новый пароль повторно'
        {...register('confirmPassword')}
        error={errors?.confirmPassword?.message}
        />

      <Button fullWidth variant='filled' loading={isLoading} onClick={handleSubmit(onSubmit)}>
        Обновить пароль
      </Button>
    </form>
  );
};