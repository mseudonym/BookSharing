import { createAsyncThunk } from "@reduxjs/toolkit";
import {postAuthLogin, postAuthRegister} from "../../generated-api/auth/auth.ts";
import {LoginRequest, RegisterRequest} from "../../generated-api/model";
import {AppDispatch, State} from "../state.ts";
import {router} from "../../main.tsx";
import {AppRoute} from "../../conts.ts";
import {getUsersMe} from "../../generated-api/users/users.ts";
import {setUserInfo} from "../spaces/user/user.slice.ts";
import {StatusCodes} from "http-status-codes";

export const loginAction = createAsyncThunk<void, LoginRequest, {
    dispatch: AppDispatch;
    state: State;
}>(
    'auth/login',
    async (payload) => {
        const response = await postAuthLogin(payload, { useCookies: true });

        if (response.status === StatusCodes.OK){
            await router.navigate(AppRoute.Root);
        }

    }
);

export const registerAction = createAsyncThunk<void, RegisterRequest, {
    dispatch: AppDispatch;
    state: State;
}>(
    'auth/register',
    async (payload) => {
        const response = await postAuthRegister(payload);

        console.log(response)
        if (response.status === StatusCodes.OK) {
            await router.navigate(AppRoute.ProfileFilling);
        }

    }
);

export const checkAuthAction = createAsyncThunk<
    void,
    undefined,
    {
        dispatch: AppDispatch;
        state: State;
    }
>(
    'auth/checkAuthStatus',
    async (_arg, { dispatch }) => {
        const { data } = await getUsersMe();

        dispatch(setUserInfo(data));
    }
);

