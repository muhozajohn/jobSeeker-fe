import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import { selectAuth } from "@/lib/redux/slices/auth/auth.slice";


export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


export const useAuth = () => {
  const auth = useSelector(selectAuth);
  return auth;
};