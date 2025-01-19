import { Routes } from "@/utilities/Constants";
import { deleteCookie } from "cookies-next/client";
import { redirect } from "next/navigation";

export default function useLogout() {
    return () => {
        deleteCookie('auth');
        redirect(Routes.Auth.Login);
    }
}