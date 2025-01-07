import { createAsyncThunk } from "@reduxjs/toolkit";
import {postAuthLogin} from "../../generated-api/auth/auth.ts";
import {LoginRequest} from "../../generated-api/model";
import {AppDispatch, State} from "../state.ts";
import {router} from "../../main.tsx";
import {AppRoute} from "../../conts.ts";
import {getUsersMe} from "../../generated-api/users/users.ts";
import {setUserInfo} from "../spaces/user/user.slice.ts";

export const login = createAsyncThunk<void, LoginRequest, {
    dispatch: AppDispatch;
    state: State;
}>(
    'auth/login',
    async (payload) => {
        const response = await postAuthLogin(payload, { useCookies: true });
        console.log(response);

        await router.navigate(AppRoute.Root);
    }
);

export const checkAuth = createAsyncThunk<
    void,
    undefined,
    {
        dispatch: AppDispatch;
        state: State;
    }
>('auth/checkAuthStatus',
    async (_arg, { dispatch }) => {
        const { data } = await getUsersMe();

        dispatch(setUserInfo(data));
    }
);