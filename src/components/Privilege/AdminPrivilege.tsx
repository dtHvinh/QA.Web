import { getFetcher } from "@/helpers/request-utils";
import { TextResponse } from "@/types/types";
import React, { memo } from "react";
import useSWR from "swr";

interface AdminPrivilegeProps {
    children: React.ReactNode;
    fallBackComponent?: React.ReactNode;
}

const AdminPrivilege = ({ children, fallBackComponent }: Readonly<AdminPrivilegeProps>) => {
    const { data: isAdmin, isLoading } = useSWR<TextResponse>('/api/user/is_role/Admin', getFetcher);

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