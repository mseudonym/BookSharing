import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as zod from 'zod';
import { PasswordInput } from '~/components/custom-mantine';

import styles from '~/components/forms/forms.module.css';

import { REQUIRED_FIELD_TEXT } from '~/conts';
import { postUsersEditProfile } from '~/generated-api/users/users';

const FormSchema = zod.object({
  oldPassword: zod
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

export const PasswordSettingsForm = () => {
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

  const { mutateAsync: updatePassword } = useMutation({
    // Поменять
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
      /*await updatePassword({
        password: data.password,
        oldPassword: data.oldPassword,
      });*/
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
      <PasswordInput
        label="Старый пароль"
        placeholder="Введите старый пароль"
        {...register('oldPassword')}
        error={errors?.oldPassword?.message}
      />

      <PasswordInput
        label="Новый пароль"
        placeholder="Введите новый пароль"
        {...register('password')}
        error={errors?.password?.message}
      />

      <PasswordInput
        label="Новый пароль ещё раз"
        placeholder="Введите новый пароль повторно"
        {...register('confirmPassword')}
        error={errors?.confirmPassword?.message}
      />

      <Button
        variant="filled"
        type="submit"
        fullWidth
        loading={isLoading} >
          Обновить пароль
      </Button>
    </form>
  );
};