import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {StoreNamespace} from "./namespaces.ts";
import {userProcess} from "./user/user.slice.ts";

export const store = configureStore({
    reducer: combineReducers({
        [StoreNamespace.User]: userProcess.reducer,
    }),
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware(),
});
