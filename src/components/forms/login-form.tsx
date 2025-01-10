import {FC} from "react";
import {InputField} from "../inputs/input-field.tsx";
import {Button} from "../buttons/button.tsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as zod from "zod";
import {useAppDispatch} from "../../store/hooks/hooks.ts";
import {loginAction} from "../../store/actions/user-actions.ts";

const FormSchema = zod.object({
    email: zod
        .string()
        .email("Некорректный email"),
    password: zod
        .string(),
});

type IFormInput = zod.infer<typeof FormSchema>;

export const LoginForm: FC = () => {
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
        dispatch(loginAction({email: data.email, password: data.password}));
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

            <Button variant={'primary'} onClick={handleSubmit(onSubmit)}>
                Войти
            </Button>

        </form>

    );
}