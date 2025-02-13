import React from "react";
import getAuth from "@/helpers/auth-utils";

export default function AdminPrivilege({children}: Readonly<{ children: React.ReactNode }>) {
    const auth = getAuth()!;

    if (!auth || auth.role !== 'Admin') {
        return null;
    }

    return (
        <div>
            {children}
        </div>
    );
}