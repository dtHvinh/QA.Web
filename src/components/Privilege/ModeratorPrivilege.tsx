import getAuth from "@/helpers/auth-utils";
import React, { useEffect, useState } from "react";

export default function ModeratorPrivilege({ children }: Readonly<{ children: React.ReactNode }>) {
    const [isModerator, setIsModerator] = useState(false);
    // TODO: Check endpoint instead

    useEffect(() => {
        const auth = getAuth();
        if (auth && auth.roles.some(e => e === 'Moderator')) {
            setIsModerator(true);
        }
    }, []);

    if (!isModerator) {
        return null;
    }

    return children;
}