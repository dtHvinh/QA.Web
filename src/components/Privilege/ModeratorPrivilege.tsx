import getAuth, { extractId } from "@/helpers/auth-utils";
import { getFetcher } from "@/helpers/request-utils";
import { TextResponse } from "@/types/types";
import React from "react";
import useSWR from "swr";

export default function ModeratorPrivilege({ children, fallBackComponent }: Readonly<{ children: React.ReactNode, fallBackComponent?: React.ReactNode }>) {
    const userId = extractId(getAuth()?.accessToken);
    const { data: isModerator, isLoading } = useSWR<TextResponse>(`/api/user/${userId}/is_role/Admin`, getFetcher);

    if (isLoading)
        return null;

    if (!isLoading && !isModerator) {
        if (fallBackComponent)
            return fallBackComponent;

        return null;
    }


    if (!isModerator) {
        return null;
    }

    return children;
}