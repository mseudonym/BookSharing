import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as zod from 'zod';

import styles from '~/components/forms/forms.module.css';

import { PasswordInput } from '~/components/custom-mantine';
import { PasswordBaseSchema, REQUIRED_FIELD_TEXT } from '~/conts';
import { postAuthManageChangePassword } from '~/generated-api/auth/auth';

const FormSchema = PasswordBaseSchema.and(
  zod.object({
    oldPassword: zod
      .string()
      .nonempty(REQUIRED_FIELD_TEXT)
  })
);

type IFormInput = zod.infer<typeof FormSchema>;

export const PasswordSettingsForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { width } = useViewportSize();
  const isRenderedOnDesktop = width >= 768;

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
    mutationFn: postAuthManageChangePassword,
    onSuccess: () => {
      notifications.show({
        title: 'Пароль обновлен',
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
    await updatePassword({ oldPassword: data.oldPassword, newPassword: data.password });
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`${styles.form} ${styles.formCenter} ${isRenderedOnDesktop && styles.formMaxWidth}`}>
      <PasswordInput
        label='Старый пароль'
        placeholder='Введите старый пароль'
        {...register('oldPassword')}
        error={errors?.oldPassword?.message}
      />

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

      <Button
        variant='filled'
        type='submit'
        fullWidth
        loading={isLoading}>
        Обновить пароль
      </Button>
    </form>
  );
};