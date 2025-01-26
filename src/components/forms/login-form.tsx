import * as zod from 'zod';
import { InputField } from '../inputs/input-field/input-field.tsx';
import { Button } from '../buttons/button.tsx';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { postAuthLogin } from '../../generated-api/auth/auth.ts';
import { saveToken } from '../../services/token.ts';
import { checkProfileFilling } from '../../actions/user-actions.ts';

const FormSchema = zod.object({
  email: zod
    .string(),
  password: zod
    .string(),
});

type IFormInput = zod.infer<typeof FormSchema>;

export const LoginForm = () => {
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
    await loginMutation({ email: data.email, password: data.password });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      <InputField
        label="Логин"
        placeholder="Введите логин"
        register={register('email')}
        error={errors?.email?.message}
      />

      <InputField
        label="Пароль"
        placeholder="Введите пароль"
        register={register('password')}
        error={errors?.password?.message}
      />

      <Button variant="primary" onClick={handleSubmit(onSubmit)}>
        Войти
      </Button>

    </form>

  );
};
