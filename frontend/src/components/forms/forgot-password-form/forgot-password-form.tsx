import { zodResolver } from '@hookform/resolvers/zod';
import { Button, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as zod from 'zod';

import styles from '~/components/forms/forms.module.css';

import { REQUIRED_FIELD_TEXT } from '~/conts';
import { postAuthForgotPassword } from '~/generated-api/auth/auth';

const FormSchema = zod.object({
  email: zod
    .string()
    .email('Некорректный email')
    .nonempty(REQUIRED_FIELD_TEXT),
});

type IFormInput = zod.infer<typeof FormSchema>;

export const ForgotPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: zodResolver(FormSchema),
    reValidateMode: 'onChange',
    mode: 'onTouched',
  });

  const { mutateAsync: resetPasswordMutation } = useMutation({
    mutationFn: postAuthForgotPassword,
    onSuccess: async () => {
      notifications.show({
        title: 'Сброс пароля',
        message: 'Ссылка для сброса пароля отправлена на почту',
        color: 'var(--green-color)',
      });
    },
    onError: () => {
      notifications.show({
        title: 'Ошибка сброса пароля',
        message: undefined,
        color: 'var(--red-color)',
      });
    }
  });

  const onSubmit = async (data: IFormInput) => {
    setIsLoading(true);
    await resetPasswordMutation({ email: data.email });
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`${styles.form} ${styles.formPadding}`}>
      <TextInput
        label='Почта'
        placeholder='Введите почту'
        {...register('email')}
        error={errors?.email?.message}
            />

      <Button fullWidth variant='filled' loading={isLoading} onClick={handleSubmit(onSubmit)}>
        Войти
      </Button>
    </form>
  );
};
