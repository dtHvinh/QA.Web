import React from "react";
import {ResourceRight} from "@/types/types";

export default function ResourceOwnerPrivilege({resourceRight, children}: {
    resourceRight: ResourceRight,
    children: React.ReactNode
}) {
    if (resourceRight !== 'Owner') {
        return null;
    }

    return (
        <div>
            {children}
        </div>
    );
}