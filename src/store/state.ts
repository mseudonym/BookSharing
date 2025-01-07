import { AuthStatus } from "../types/auth-status";
import {UserData, UserProfile} from "../generated-api/model";
import {store} from "./store.ts";

export type State = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type UserState = {
    AuthStatus: AuthStatus;
    UserInfo: UserData | null;
    Friends: UserProfile[];
};

// export type ItemsState = {
//     Books: Item[];
// };
