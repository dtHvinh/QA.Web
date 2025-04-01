import { getFetcher } from "@/helpers/request-utils";
import { TextResponse } from "@/types/types";
import React from "react";
import useSWR from "swr";

export default function ModeratorPrivilege({ children, fallBackComponent }: Readonly<{ children: React.ReactNode, fallBackComponent?: React.ReactNode }>) {
    const { data: isModerator, isLoading } = useSWR<TextResponse>('/api/user/is_role/Moderator', getFetcher);

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