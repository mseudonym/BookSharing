import { zodResolver } from '@hookform/resolvers/zod';
import { Anchor, Button, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as zod from 'zod';

import _styles from '~/index.module.css';

import { checkProfileFilling } from '~/actions/user-actions';
import { PasswordInput } from '~/components/inputs/password-input/password-input';
import { AppRoute, REQUIRED_FIELD_TEXT } from '~/conts';
import { postAuthLogin } from '~/generated-api/auth/auth';
import { saveToken } from '~/services/token';

const FormSchema = zod.object({
  email: zod
    .string()
    .email('Некорректный email')
    .nonempty(REQUIRED_FIELD_TEXT),
  password: zod
    .string()
    .nonempty(REQUIRED_FIELD_TEXT),
});

type IFormInput = zod.infer<typeof FormSchema>;

export const LoginForm = () => {
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

  const { mutateAsync: loginMutation } = useMutation({
    mutationFn: postAuthLogin,
    onSuccess: async (response) => {
      saveToken(response.accessToken!, response.tokenType!);
      await checkProfileFilling();
    },
  });

  const onSubmit = async (data: IFormInput) => {
    try {
      setIsLoading(true);
      await loginMutation({ email: data.email, password: data.password });
    } catch (error) {
      notifications.show({
        title: 'Ошибка входа',
        message: undefined,
        color: 'var(--red-color)',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={_styles.form}>

      <TextInput
        label="Почта"
        placeholder="Введите почту"
        {...register('email')}
        error={errors?.email?.message}
      />

      <PasswordInput
        label="Пароль"
        placeholder="Введите пароль"
        {...register('password')}
        error={errors?.password?.message}
      />

      <Anchor className={_styles.anchorGray} href={AppRoute.ForgotPassword}>Я не помню пароль</Anchor>

      <Button fullWidth variant="filled" loading={isLoading} onClick={handleSubmit(onSubmit)}>
        Войти
      </Button>

    </form>

  );
};
