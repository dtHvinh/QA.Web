'use client'

import AccessDenied from "@/components/Privilege/AccessDenied";
import ModeratorPrivilege from "@/components/Privilege/ModeratorPrivilege";

export default function ModeratorPage() {
    return (
        <ModeratorPrivilege fallBackComponent={<AccessDenied />}>
            <div className="page-container mx-auto">
                Mod
            </div>
        </ModeratorPrivilege>
    )
}