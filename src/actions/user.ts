import {getUsersMe} from "../generated-api/users/users.ts";
import axios, {AxiosError} from "axios";
import {StatusCodes} from "http-status-codes";
import {router} from "../main.tsx";
import {AppRoute} from "../conts.ts";

export const checkAuth = async () => {
    await getUsersMe()
        .catch(async (error: Error | AxiosError) => {
            if (axios.isAxiosError(error)) {
                switch (error.status) {
                    case StatusCodes.UNAUTHORIZED:
                        await router.navigate(AppRoute.Root);
                }
            }
        });
}