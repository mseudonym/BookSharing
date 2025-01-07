import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {store} from "../store.ts";
import {AppDispatch} from "../state.ts";

export type State = ReturnType<typeof store.getState>;

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<State> = useSelector;
