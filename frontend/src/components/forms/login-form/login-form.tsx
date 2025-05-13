import { zodResolver } from '@hookform/resolvers/zod';
import { Button, TextInput } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import * as zod from 'zod';

import styles from '~/components/forms/styles.module.css';
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
  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
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
    await loginMutation({ email: data.email, password: data.password });
  };

  console.log(errors.email?.message);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>

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

      <Link className={_styles.link} to={AppRoute.ForgotPassword}>Я не помню пароль</Link>

      <Button fullWidth variant="filled" loading={isLoading} onClick={handleSubmit(onSubmit)}>
        Войти
      </Button>

    </form>

  );
};
