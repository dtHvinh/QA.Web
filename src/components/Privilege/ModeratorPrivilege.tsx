import React, { useEffect, useState } from "react";
import getAuth from "@/helpers/auth-utils";

export default function ModeratorPrivilege({ children }: Readonly<{ children: React.ReactNode }>) {
    const [isModerator, setIsModerator] = useState(false);

    useEffect(() => {
        const auth = getAuth();
        if (auth && auth.roles.some(e => e === 'Moderator')) {
            setIsModerator(true);
        }
    }, []);

    if (!isModerator) {
        return null;
    }

    return (
        <>
            {children}
        </>
    );
}