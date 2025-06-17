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
import { PasswordInput } from '~/components/custom-mantine';
import { PasswordBaseSchema, REQUIRED_FIELD_TEXT } from '~/conts';
import { postAuthLogin, postAuthRegister } from '~/generated-api/auth/auth';
import { saveToken } from '~/services/token';

const FormSchema = PasswordBaseSchema.and(
  zod.object({
    email: zod
      .string()
      .nonempty(REQUIRED_FIELD_TEXT)
  })
);

type IFormInput = zod.infer<typeof FormSchema>;

export const RegistrationForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: zodResolver(FormSchema),
    reValidateMode: 'onChange',
    mode: 'onTouched',
  });

  const { mutateAsync: registerMutation } = useMutation({
    mutationFn: postAuthRegister,
    onError: (error: AxiosError<{
      errors: {
        DuplicateEmail?: string[];
      }
    }>) => {
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData.errors) {
          const errorMessage = (errorData.errors.DuplicateEmail?.[0] && 'Email уже занят') ||
            undefined;

          notifications.show({
            title: 'Ошибка регистрации',
            message: errorMessage,
            color: 'var(--red-color)',
          });
        }
      }
    }
  });

  const [isLoading, setIsLoading] = useState(false);

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
      await registerMutation({ email: data.email, password: data.password })
        .then(async () => await loginMutation({ email: data.email, password: data.password }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>

      <TextInput
        label='Почта'
        placeholder='Введите почту'
        {...register('email')}
        error={errors?.email?.message}
      />

      <PasswordInput
        label='Пароль'
        placeholder='Введите пароль'
        {...register('password')}
        error={errors?.password?.message}
      />

      <PasswordInput
        label='Пароль ещё раз'
        placeholder='Введите пароль повторно'
        {...register('confirmPassword')}
        error={errors?.confirmPassword?.message}
      />

      <Button fullWidth variant='filled' onClick={handleSubmit(onSubmit)} loading={isLoading}>
        Зарегистрироваться
      </Button>

    </form>

  );
};
