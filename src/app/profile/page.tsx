'use client'

import getAuth from "@/helpers/auth-utils";
import {Avatar, Tooltip} from "@mui/material";
import useSWR from "swr";
import {backendURL} from "@/utilities/Constants";
import {getFetcher} from "@/helpers/request-utils";
import {UserResponse} from "@/types/types";
import Loading from "@/app/loading";
import FetchFail from "@/components/FetchFail";
import timeFromNow from "@/helpers/time-utils";
import Link from "next/link";

export default function ProfilePage() {
    const auth = getAuth();

    const {data, isLoading} = useSWR([`${backendURL}/api/user/`, auth?.accessToken], getFetcher);

    if (isLoading)
        return <Loading/>

    const user = data as UserResponse;

    if (!data)
        return <FetchFail error={'User not found'}/>

    return (
        <div>
            <div className="container mx-auto p-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between">
                        <div className={'flex space-x-6 items-center'}>
                            <Avatar variant={'square'}
                                    src={auth?.profilePicture}
                                    component={'div'}
                                    alt="Profile Picture"
                                    sx={{width: 80, height: 80}}/>
                            <div>
                                <h1 className="text-2xl font-bold">{user.username}</h1>
                                <div className="mt-2 space-x-2.5">
                                    <span className={'text-gray-500'}>external links:</span>
                                    <a href="#" className="text-blue-500 hover:underline">Website</a>
                                    <a href="#" className="text-blue-500 hover:underline">GitHub</a>
                                </div>

                                <div>
                                    <span className={'mt-2 text-gray-500'}>Joined {timeFromNow(user.dateJoined)}</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <Tooltip title={'Edit'}>
                                <button>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="currentColor"
                                         className="bi bi-pencil-square" viewBox="0 0 16 16">
                                        <path
                                            d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                        <path fillRule="evenodd"
                                              d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                                    </svg>
                                </button>
                            </Tooltip>
                        </div>
                    </div>
                </div>

                {/*<div className="mt-6 bg-white p-6 rounded-lg shadow-md">*/}
                {/*    <h2 className="text-xl font-semibold mb-4">Reputation & Badges</h2>*/}
                {/*    <div className="flex space-x-6">*/}
                {/*        <div>*/}
                {/*            <p className="text-gray-600">Reputation</p>*/}
                {/*            <p className="text-2xl font-bold">12,345</p>*/}
                {/*        </div>*/}
                {/*        <div>*/}
                {/*            <p className="text-gray-600">Badges</p>*/}
                {/*            <div className="flex space-x-2">*/}
                {/*                <span*/}
                {/*                    className="bg-yellow-500 text-white px-2 py-1 rounded-full text-sm">Gold (5)</span>*/}
                {/*                <span*/}
                {/*                    className="bg-gray-400 text-white px-2 py-1 rounded-full text-sm">Silver (10)</span>*/}
                {/*                <span*/}
                {/*                    className="bg-orange-500 text-white px-2 py-1 rounded-full text-sm">Bronze (20)</span>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}

                <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Activity Summary</h2>
                    <div className="grid grid-cols-3 gap-4">
                        <Link href={'/your-questions'} className="text-center">
                            <p className="text-gray-600">Questions</p>
                            <p className="text-2xl font-bold">{user.questionCount}</p>
                        </Link>
                        <div className="text-center">
                            <p className="text-gray-600">Answers</p>
                            <p className="text-2xl font-bold">{user.answerCount}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-600">Comments</p>
                            <p className="text-2xl font-bold">{user.commentCount}</p>
                        </div>
                    </div>
                </div>

                {/*<div className="mt-6 bg-white p-6 rounded-lg shadow-md">*/}
                {/*    <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>*/}
                {/*    <ul className="space-y-4">*/}
                {/*        <li>*/}
                {/*            <p className="text-gray-600">Asked: <a href="#" className="text-blue-500 hover:underline">How*/}
                {/*                to use Tailwind CSS?</a></p>*/}
                {/*            <p className="text-sm text-gray-500">2 hours ago</p>*/}
                {/*        </li>*/}
                {/*        <li>*/}
                {/*            <p className="text-gray-600">Answered: <a href="#"*/}
                {/*                                                      className="text-blue-500 hover:underline">React vs*/}
                {/*                Angular</a></p>*/}
                {/*            <p className="text-sm text-gray-500">5 hours ago</p>*/}
                {/*        </li>*/}
                {/*        <li>*/}
                {/*            <p className="text-gray-600">Commented: <a href="#"*/}
                {/*                                                       className="text-blue-500 hover:underline">Best*/}
                {/*                practices for REST APIs</a></p>*/}
                {/*            <p className="text-sm text-gray-500">1 day ago</p>*/}
                {/*        </li>*/}
                {/*    </ul>*/}
                {/*</div>*/}

                {/*<div className="mt-6 bg-white p-6 rounded-lg shadow-md">*/}
                {/*    <h2 className="text-xl font-semibold mb-4">Top Tags</h2>*/}
                {/*    <div className="space-y-2">*/}
                {/*        <div className="flex justify-between">*/}
                {/*            <span className="text-blue-500">#javascript</span>*/}
                {/*            <span className="text-gray-600">1,234 score</span>*/}
                {/*        </div>*/}
                {/*        <div className="flex justify-between">*/}
                {/*            <span className="text-blue-500">#react</span>*/}
                {/*            <span className="text-gray-600">987 score</span>*/}
                {/*        </div>*/}
                {/*        <div className="flex justify-between">*/}
                {/*            <span className="text-blue-500">#tailwindcss</span>*/}
                {/*            <span className="text-gray-600">654 score</span>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>
        </div>
    );
}