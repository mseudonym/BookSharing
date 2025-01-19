import {FC} from "react";
import {InputField} from "../inputs/input-field/input-field.tsx";
import {Button} from "../buttons/button.tsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as zod from "zod";
import { useMutation } from "@tanstack/react-query";
import {postAuthLogin, postAuthRegister} from "../../generated-api/auth/auth.ts";
import {saveToken} from "../../services/token.ts";
import {checkProfileFilling} from "../../actions/user-actions.ts";

const FormSchema = zod.object({
  email: zod
    .string()
    .email("Некорректный email"),
  password: zod
    .string()
    .min(6, 'Пароль должен быть не меньше 6-ти символов')
    .regex(/[0-9]+/, 'Пароль должен содержать минимум одну цифру')
    .regex(/[a-z]+/, 'Пароль должен содержать минимум одну строчную латинскую букву')
    .regex(/[A-Z]+/, 'Пароль должен содержать минимум одну заглавную латинскую букву')
    .regex(/[^0-9a-zA-Z]+/, 'Пароль должен содержать минимум один не буквенный и не числовой символ'),
  confirmPassword: zod
    .string(),
}).superRefine(({ confirmPassword, password }, ctx) => {
  if (confirmPassword !== password) {
    ctx.addIssue({
      code: "custom",
      message: "Пароли не совпадают",
      path: ['confirmPassword']
    });
  }
});

type IFormInput = zod.infer<typeof FormSchema>;

export const RegistrationForm: FC = () => {
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
  });

    const {mutateAsync: loginMutation} = useMutation({
        mutationFn: postAuthLogin,
        onSuccess: async (response) => {
            saveToken(response.accessToken!, response.tokenType!);
            await checkProfileFilling();
        },
    });


    const onSubmit = async (data: IFormInput) => {
        await registerMutation({email: data.email, password: data.password})
            .then(async () => await loginMutation({email: data.email, password: data.password}));
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            <InputField
                label={"Почта"}
                placeholder={"Введите почту"}
                register={register("email")}
                error={errors?.email?.message}
            />

            <InputField
                label={"Пароль"}
                placeholder={"Введите пароль"}
                register={register("password")}
                error={errors?.password?.message}
            />

            <InputField
                label={"Пароль ещё раз"}
                placeholder={"Повторите пароль"}
                register={register("confirmPassword")}
                error={errors?.confirmPassword?.message}
            />

            <Button variant={'primary'} onClick={handleSubmit(onSubmit)}>
                Зарегистрироваться
            </Button>

        </form>

    );
}
