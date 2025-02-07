'use client'

import getAuth from "@/helpers/auth-utils";
import {backendURL} from "@/utilities/Constants";
import useSWR from "swr";
import {getFetcher} from "@/helpers/request-utils";
import {UserResponse} from "@/types/types";
import Loading from "@/app/loading";

export default function Home() {
    const requestUrl = `${backendURL}/api/user/`;
    const auth = getAuth();

    const {data, isLoading} = useSWR([requestUrl, auth?.accessToken], getFetcher);

    if (isLoading)
        return <Loading/>

    const user = data as UserResponse;

    return (
        <div className="grid grid-cols-3 gap-4 mt-2">
            <div className="text-2xl col-span-3">
                Hello, {auth?.username}
            </div>

            <div className="gap-4 col-span-3 md:col-span-1 h-full m-2 p-4 flex flex-col">
                <div className="text-lg font-semibold">
                    Reputation
                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex">
                        <div className="w-3/4 -ml-4 text-center">
                            {user.reputation}
                        </div>
                        <svg viewBox="0 0 180 30" xmlns="http://www.w3.org/2000/svg">
                            <rect width="100%" height="33%" fill="lightblue">
                            </rect>
                            <rect y="20" width="100%" height="33%" fill="lightblue">
                            </rect>
                            <path
                                d="M0 27 L90 9.857142857142858 L108 13.285714285714285 L126 9.857142857142858 L144 13.285714285714285 L180 3"
                                stroke="blue" strokeDasharray="6, 6" strokeWidth="3" fill="none">
                            </path>
                        </svg>
                    </div>
                    <small>Earn reputation by ask and answer a question</small>
                </div>
            </div>

        </div>
    );
}
