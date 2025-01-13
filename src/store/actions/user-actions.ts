import {createAsyncThunk} from "@reduxjs/toolkit";
import {postAuthLogin, postAuthRegister} from "../../generated-api/auth/auth.ts";
import {LoginRequest, RegisterRequest} from "../../generated-api/model";
import {AppDispatch, State} from "../state.ts";
import {router} from "../../main.tsx";
import {AppRoute} from "../../conts.ts";
import {getUsersMe} from "../../generated-api/users/users.ts";
import {setAuthStatus, setFriends, setUserData} from "../spaces/user/user.slice.ts";
import axios, {AxiosError} from "axios";
import {StatusCodes} from "http-status-codes";
import {AuthStatus} from "../../types/auth-status.ts";
import {getFriendsList} from "../../generated-api/friends/friends.ts";
import {saveToken} from "../../services/token.ts";

export const loginAction = createAsyncThunk<void, LoginRequest, {
    dispatch: AppDispatch;
    state: State;
}>(
    'auth/login',
    async (payload, { dispatch }) => {
        await postAuthLogin(payload)
            .then(async (result) => {
                saveToken(result.accessToken!, result.tokenType!)
                dispatch(fetchUserSlice());
            });
    }
);

export const registerAction = createAsyncThunk<void, RegisterRequest, {
    dispatch: AppDispatch;
    state: State;
}>(
    'auth/register',
    async (payload, { dispatch }) => {
        await postAuthRegister(payload)
            .then(async () => {
                dispatch(loginAction({email: payload.email, password: payload.password}));
            })
            .catch(async (error: Error | AxiosError) => {
                if (axios.isAxiosError(error)) {
                    switch (error.status) {
                        case StatusCodes.UNAUTHORIZED:
                            setAuthStatus(AuthStatus.NoAuth);
                            await router.navigate(AppRoute.Root);
                    }
                }
            });
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
    async (_arg, {dispatch}) => {
        await getUsersMe()
            .then(async (userData) => {
                    dispatch(setAuthStatus(AuthStatus.Auth));
                    dispatch(setUserData(userData));
                    dispatch(fetchUserSlice())
                }
            )
            .catch(async (error: Error | AxiosError) => {
                if (axios.isAxiosError(error)) {
                    switch (error.status) {
                        case StatusCodes.UNAUTHORIZED:
                            dispatch(setAuthStatus(AuthStatus.NoAuth));
                            await router.navigate(AppRoute.Root);
                    }
                }
            });
    }
);

export const fetchUserSlice = createAsyncThunk<void, undefined, {
    dispatch: AppDispatch;
    state: State;
}>(
    'fetchUserData',
    async (_args, {dispatch}) => {
        const userData = await getUsersMe();
        dispatch(setUserData(userData));

        //if (!userData.isEmailConfirm || !userData.isProfileFilled){
        //    await router.navigate(AppRoute.ProfileFilling);
        //}

        const userFriends = await getFriendsList();
        dispatch(setFriends(userFriends));
    }
);
