import getAuth from "@/helpers/auth-utils";
import React, { memo, useEffect, useState } from "react";

interface AdminPrivilegeProps {
    children: React.ReactNode;
    fallBackComponent?: React.ReactNode;
}

const AdminPrivilege = ({ children, fallBackComponent }: Readonly<AdminPrivilegeProps>) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // TODO: Check endpoint instead
    useEffect(() => {
        const auth = getAuth();
        if (auth && auth.roles.some(e => e === 'Admin')) {
            setIsAdmin(true);
        }

        setIsLoading(false);
    }, []);

    if (isLoading)
        return null;

    if (!isLoading && !isAdmin) {
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

export default memo(AdminPrivilege);