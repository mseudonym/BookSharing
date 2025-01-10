import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {UserState} from "../../state.ts";
import {AuthStatus} from "../../../types/auth-status.ts";
import {UserData, UserProfile} from "../../../generated-api/model";
import {StoreNamespace} from "../store-namespaces.ts";

const initialState: UserState = {
    AuthStatus: AuthStatus.Unknown,
    UserData: null,
    Friends: [],
}

export const userProcess = createSlice({
    name: StoreNamespace.User,
    initialState,
    reducers: {
        setAuthStatus: (state, action: PayloadAction<AuthStatus>) => {
            state.AuthStatus = action.payload;
        },
        setUserData: (state, action: PayloadAction<UserData | null>) => {
            state.UserData = action.payload;
        },
        setFriends: (state, action: PayloadAction<UserProfile[]>) => {
            state.Friends = action.payload;
        }
    },
    extraReducers() {
    }
})

export const {setAuthStatus, setUserData, setFriends} = userProcess.actions;