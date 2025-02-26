import React, { useEffect, useState } from "react";
import getAuth from "@/helpers/auth-utils";

export default function AdminPrivilege({ children }: Readonly<{ children: React.ReactNode }>) {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const auth = getAuth();
        if (auth && auth.roles.some(e => e === 'Admin')) {
            setIsAdmin(true);
        }
    }, []);

    if (!isAdmin) {
        return null;
    }

    return (
        <>
            {children}
        </>
    );
}