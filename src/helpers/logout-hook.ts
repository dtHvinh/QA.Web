import { Routes } from "@/utilities/Constants";
import { redirect } from "next/navigation";
import getAuth, { removeAuth } from "./auth-utils";

export default function useLogout() {
    return () => {
        const auth = getAuth();
        if (auth)
            removeAuth(auth);
        redirect(Routes.Auth.Login);
    }
}