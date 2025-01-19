import React, {FC} from "react";
import {useQuery} from "@tanstack/react-query";
import {getGetUsersMeQueryKey, getUsersMe} from "../../generated-api/users/users.ts";
import styles from "./profile-filling-page.module.css"
import { Page } from "../../ui/page/page.tsx";


export const ProfileFillingPage: FC = () => {

    const {data: userData} = useQuery({
        queryFn: () => getUsersMe(),
        queryKey: getGetUsersMeQueryKey(),
    })

    return (
        <Page>
            <div className={styles.content}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Создание профиля</h1>
                    <button className={styles.backButton} aria-label="Go back">
                        <img
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/b863cf19faa87780bafcf44b0ef0e7b59ca727361d2713b8cd80d616f17d9f91?apiKey=ab84aefce8424550a816a7ab4725a615&"
                            className={styles.icon}
                            alt=""
                        />
                    </button>
                </header>

                <div className={styles.avatarSection}>
                    <div className={styles.avatarWrapper}>
                        <button className={styles.avatarButton} aria-label="Upload profile picture">
                            <img
                                src="https://cdn.builder.io/api/v1/image/assets/TEMP/dd39aca818fe1686948b26b1661785431a1ccb67f8a7b11489014ac397105dcd?apiKey=ab84aefce8424550a816a7ab4725a615&"
                                className={styles.uploadIcon}
                                alt=""
                            />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {formFields.map((field, index) => (
                        <InputField
                            key={index}
                            label={field.label}
                            placeholder={field.placeholder}
                        />
                    ))}
                    <button type="submit" className={styles.submitButton}>
                        Создать профиль
                    </button>
                </form>
            </div>
        </Page>
    );
}