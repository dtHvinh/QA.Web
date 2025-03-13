'use client'

import Loading from "@/app/loading";
import getAuth from "@/helpers/auth-utils";
import { getFetcher } from "@/helpers/request-utils";
import { highlightCode } from "@/helpers/utils";
import { TagDetailResponse } from "@/types/types";
import { backendURL } from "@/utilities/Constants";
import { Typography } from "@mui/material";
import 'highlight.js/styles/github.css';
import React, { useEffect } from "react";
import useSWR from "swr";

export default function TagWikiPage({ params }: { params: Promise<{ path: string[] }> }) {
    const { path } = React.use(params);
    const requestUrl = `${backendURL}/api/tag/wiki/${path[0]}`;
    const auth = getAuth();
    const { data, isLoading } = useSWR([requestUrl, auth!.accessToken], getFetcher);

    const tagDetail = data as TagDetailResponse;

    useEffect(() => {
        highlightCode();
    }, [data]);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className={'page-container mx-auto'}>
            <div>
                <Typography variant={'h4'} fontWeight={'bold'}>{tagDetail.name}</Typography>
            </div>

            <div className={'text-editor-display'}>
                <div className={'mt-5 tiptap'}
                    dangerouslySetInnerHTML={{ __html: tagDetail.wikiBody }}></div>
            </div>
        </div>
    );
}