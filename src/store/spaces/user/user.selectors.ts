import {State} from "../../state.ts";
import { StoreNamespace } from "../store-namespaces.ts";

export const getAuthStatus = (state: State) =>
    state[StoreNamespace.User].AuthStatus;

export const getUserData = (state: State) =>
    state[StoreNamespace.User].UserData;

export const getUserFriends = (state: State) =>
    state[StoreNamespace.User].Friends;