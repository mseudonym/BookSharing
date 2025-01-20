import {getUsersMe} from "../generated-api/users/users.ts";
import axios, {AxiosError} from "axios";
import {StatusCodes} from "http-status-codes";
import {router} from "../main.tsx";
import {AppRoute} from "../conts.ts";
import {UserData} from "../generated-api/model";

export const checkAuth = async () => {
    await getUsersMe()
        .then(async user => {
            await checkProfileFilling(user, false);
        })
        .catch(async (error: Error | AxiosError) => {
            if (axios.isAxiosError(error)) {
                switch (error.status) {
                    case StatusCodes.UNAUTHORIZED:
                        await router.navigate(AppRoute.Root);
                }
            }
        });
}

export const checkProfileFilling = async (user?: UserData, redirectToDefault: boolean = true) => {
    if (user === undefined) {
        await checkAuth();
        return
    }

    if (!user.isEmailConfirm){
        await router.navigate(AppRoute.EmailConfirmation);
        return;
    }
    if (!user.isProfileFilled){
        await router.navigate(AppRoute.ProfileFilling);
        return;
    }

    if (redirectToDefault){
      await router.navigate(AppRoute.Shelf);
    }
}
