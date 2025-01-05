import {UserState} from "../state.ts";

export const getAuthStatus = (state: UserState) =>
    state.AuthStatus;

