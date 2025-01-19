import _styles from '../../index.module.css';
import styles from './email-confirmation-page.module.css';
import {FC} from 'react';
import {Page} from "../../ui/page/page.tsx";
import {useMutation, useQuery} from "@tanstack/react-query";
import {getGetUsersMeQueryKey, getUsersMe} from "../../generated-api/users/users.ts";
import {useEffect, useState} from "react";
import {postAuthResendConfirmationEmail} from "../../generated-api/auth/auth.ts";
import {checkProfileFilling} from "../../actions/user-actions.ts";

const RESEND_CONFIRMATION_EMAIL_SECONDS = 10;

export const EmailConfirmationPage: FC = () => {
    const [seconds, setSeconds] = useState<number>(RESEND_CONFIRMATION_EMAIL_SECONDS);

    const {mutateAsync: resendConfirmationEmail} = useMutation({
        mutationFn: postAuthResendConfirmationEmail,
        onMutate: async () => {
            setSeconds(RESEND_CONFIRMATION_EMAIL_SECONDS);
        },
    });

    useEffect(() => {
        const timeInterval = setTimeout(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
            }
        }, 1000);
        return () => {
            clearInterval(timeInterval);
        };
    });

    const {data: userData} = useQuery({
        queryFn: () => getUsersMe(),
        queryKey: getGetUsersMeQueryKey(),
        refetchInterval: 6000,
    })

    useEffect( () => {
        if (userData?.isEmailConfirm){
            checkProfileFilling(userData).then();
        }
    },[userData])


    return (
        <Page>
            <div className={styles.content}>
                <h1 className={_styles.title}>
                    Ожидаем подтверждение почты
                </h1>
                <p className={_styles.description}>
                    Чтобы это сделать, перейдите по ссылке, отправленной на почту.
                    Если письма не видно — проверьте Спам, оно могло попасть туда.
                </p>
                <div >
                    <img
                        src="/../../src/assets/mail.svg"
                        alt="Email confirmation illustration"
                    />
                </div>
                {seconds === 0
                    ?
                    <p className={_styles.textLink} onClick={() => resendConfirmationEmail({email: userData?.email ?? ""})}>
                        Отправить письмо ещё раз
                    </p>
                    :
                    <p className={_styles.description}>
                        {`Отправить письмо повторно можно через ${seconds} секунд.`}
                    </p>
                }
            </div>
        </Page>
    );
};