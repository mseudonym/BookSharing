import {FC} from "react";
import {InputField} from "../inputs/input-field.tsx";
import {Button} from "../buttons/button.tsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as zod from "zod";
import {useAppDispatch} from "../../store/hooks/hooks.ts";
import {registerAction} from "../../store/actions/user.ts";

const FormSchema = zod.object({
    email: zod
        .string()
        .email("Некорректный email"),
    password: zod
        .string()
        .min(6, 'Пароль должен быть не меньше 6-ти символов')
        .regex(/[0-9]+/, 'Пароль должен содержать минимум одну цифру')
        .regex(/[a-z]+/, 'Пароль должен содержать минимум одну строчную латинскую букву')
        .regex(/[A-Z]+/, 'Пароль должен содержать минимум одну заглавную латинскую букву'),
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
    const dispatch = useAppDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IFormInput>({
        resolver: zodResolver(FormSchema),
        reValidateMode: 'onChange',
        mode: 'onTouched',
    });

    const onSubmit = (data: IFormInput) => {
        dispatch(registerAction(data));
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