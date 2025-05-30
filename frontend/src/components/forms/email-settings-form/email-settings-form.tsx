import { zodResolver } from '@hookform/resolvers/zod';
import { Button, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as zod from 'zod';

import styles from '~/components/forms/forms.module.css';

import { REQUIRED_FIELD_TEXT } from '~/conts';
import {postAuthManageChangeEmail} from "~/generated-api/auth/auth";

const FormSchema = zod.object({
  email: zod
    .string()
    .nonempty(REQUIRED_FIELD_TEXT),
});

type IFormInput = zod.infer<typeof FormSchema>;

export const EmailSettingsForm = () => {
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

  const { mutateAsync: updateEmail } = useMutation({
    mutationFn: postAuthManageChangeEmail,
    onSuccess: () => {
      notifications.show({
        title: 'Ссылка для подтверждения отправлена на новую почту',
        message: undefined,
        color: 'var(--green-color)',
      });
    }
  });

  const onSubmit = async (data: IFormInput) => {
    try {
      setIsLoading(true);
      await updateEmail({
        newEmail: data.email,
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
      <TextInput
        label="Новая почта"
        placeholder="Введите новую почту"
        {...register('email')}
        error={errors?.email?.message}
      />
      <Button
        variant="filled"
        type="submit"
        fullWidth
        loading={isLoading} >
          Подтвердить почту
      </Button>
    </form>
  );
};