import getAuth from "@/helpers/auth-utils";
import React, { useEffect, useState } from "react";

interface AdminPrivilegeProps {
    children: React.ReactNode;
    fallBackComponent?: React.ReactNode;
}

export default function AdminPrivilege({ children, fallBackComponent }: Readonly<AdminPrivilegeProps>) {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const auth = getAuth();
        if (auth && auth.roles.some(e => e === 'Admin')) {
            setIsAdmin(true);
        }
    }, []);

    if (!isAdmin) {
        if (fallBackComponent)
            return fallBackComponent;

        return null;
    }

    return (
        <>
            {children}
        </>
    );
}