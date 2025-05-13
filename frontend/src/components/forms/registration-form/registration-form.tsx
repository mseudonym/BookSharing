import { zodResolver } from '@hookform/resolvers/zod';
import { Button, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as zod from 'zod';

import styles from '~/components/forms/styles.module.css';

import { checkProfileFilling } from '~/actions/user-actions';
import { PasswordInput } from '~/components/inputs/password-input/password-input';
import { REQUIRED_FIELD_TEXT } from '~/conts';
import { postAuthLogin, postAuthRegister } from '~/generated-api/auth/auth';
import { saveToken } from '~/services/token';


const FormSchema = zod.object({
  email: zod
    .string()
    .nonempty(REQUIRED_FIELD_TEXT),
  password: zod
    .string()
    .min(12, 'Пароль должен быть не меньше 12-ти символов')
    .regex(/[0-9]+/, 'Пароль должен содержать минимум одну цифру')
    .regex(/[a-z]+/, 'Пароль должен содержать минимум одну строчную латинскую букву')
    .regex(/[A-Z]+/, 'Пароль должен содержать минимум одну заглавную латинскую букву')
    .regex(/[^0-9a-zA-Z]+/, 'Пароль должен содержать минимум один не буквенный и не числовой символ')
    .nonempty(REQUIRED_FIELD_TEXT),
  confirmPassword: zod
    .string()
    .nonempty(REQUIRED_FIELD_TEXT),
}).superRefine(({ confirmPassword, password }, ctx) => {
  if (confirmPassword !== password) {
    ctx.addIssue({
      code: 'custom',
      message: 'Пароли не совпадают',
      path: ['confirmPassword'],
    });
  }
});

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
        DuplicateUserName?: string[];
        DuplicateEmail?: string[];
      }
    }>) => {
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData.errors) {
          const errorMessage = (errorData.errors.DuplicateEmail?.[0] ? 'Email уже занят' : '') || 
                             (errorData.errors.DuplicateUserName?.[0] ? 'Имя пользователя уже занято' : '') || 
                             'Произошла ошибка при регистрации';
          
          notifications.show({
            title: 'Ошибка регистрации',
            message: errorMessage,
            color: 'var(--red-color)',

          });
        }
      }
    }
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
      await registerMutation({ email: data.email, password: data.password })
        .then(async () => await loginMutation({ email: data.email, password: data.password }));
    } catch (error) {
      // Общая ошибка будет обработана в onError мутации
    }
  };

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

      <PasswordInput
        label="Пароль ещё раз"
        placeholder="Введите пароль повторно"
        {...register('confirmPassword')}
        error={errors?.confirmPassword?.message}
      />

      <Button fullWidth variant="filled" onClick={handleSubmit(onSubmit)}>
        Зарегистрироваться
      </Button>

    </form>

  );
};
