'use client'

import React, {useEffect} from "react";
import {backendURL} from "@/utilities/Constants";
import useSWR from "swr";
import getAuth from "@/helpers/auth-utils";
import {getFetcher} from "@/helpers/request-utils";
import {TagDetailResponse} from "@/types/types";
import {Typography} from "@mui/material";
import Loading from "@/app/loading";
import 'highlight.js/styles/github.css';
import hljs from "highlight.js";

export default function TagWikiPage({params}: { params: Promise<{ path: string[] }> }) {
    const {path} = React.use(params);
    const requestUrl = `${backendURL}/api/tag/${path[0]}`;
    const auth = getAuth();
    const {data, error, isLoading} = useSWR([requestUrl, auth?.accessToken], getFetcher);

    const tagDetail = data as TagDetailResponse;

    useEffect(() => {
        hljs.highlightAll();
    }, [data]);

    if (isLoading) {
        return <Loading/>;
    }

    return (
        <div className={'flex flex-col'}>
            <div>
                <Typography variant={'h4'} fontWeight={'bold'}>{tagDetail.name}</Typography>
            </div>

            <div className={'text-editor-display'}>
                <div className={'mt-5 tiptap'}
                     dangerouslySetInnerHTML={{__html: tagDetail.wikiBody}}></div>
            </div>
        </div>
    );
}