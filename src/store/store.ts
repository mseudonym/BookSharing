import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {userProcess} from "./spaces/user/user.slice.ts";
import { StoreNamespace } from "./spaces/store-namespaces.ts";

export const store = configureStore({
    reducer: combineReducers({
        [StoreNamespace.User]: userProcess.reducer,
    }),
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware(),
});
