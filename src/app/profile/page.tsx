'use client'

import getAuth from "@/helpers/auth-utils";
import { Avatar, Tooltip } from "@mui/material";
import useSWR from "swr";
import { backendURL } from "@/utilities/Constants";
import { getFetcher } from "@/helpers/request-utils";
import { UserResponse } from "@/types/types";
import Loading from "@/app/loading";
import FetchFail from "@/components/FetchFail";
import { countTotalDays } from "@/helpers/time-utils";
import Link from "next/link";
import { useState } from "react";
import EditMode from "./EditMode";
import { Edit } from "@mui/icons-material";

export default function ProfilePage() {
    const auth = getAuth();
    const [isEditMode, setIsEditMode] = useState(false)
    const { data, isLoading } = useSWR([`${backendURL}/api/user/`, auth?.accessToken], getFetcher);

    if (isLoading)
        return <Loading />

    const user = data as UserResponse;

    if (!data)
        return <FetchFail error={'User not found'} />

    return (
        <div>
            <div className="container mx-auto p-6">
                {
                    isEditMode ? <EditMode onEditModeClick={() => setIsEditMode(false)} profile={user} /> :
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex justify-between">
                                <div className={'flex space-x-6 items-center'}>
                                    <Avatar variant={'square'}
                                        src={auth?.profilePicture}
                                        component={'div'}
                                        alt="Profile Picture"
                                        sx={{ width: 80, height: 80 }} />
                                    <div>
                                        <h1 className="text-2xl font-bold">{user.username}</h1>
                                        <div className="mt-2 space-x-2.5">
                                            <span className={'text-gray-500'}>external links:</span>
                                            <a href="#" className="text-blue-500 hover:underline">Website</a>
                                            <a href="#" className="text-blue-500 hover:underline">GitHub</a>
                                        </div>

                                        <div>
                                            <span
                                                className={'mt-2 text-gray-500'}>Joined {countTotalDays(user.dateJoined)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <Tooltip title={'Edit'}>
                                        <button onClick={() => setIsEditMode(true)}>
                                            <Edit />
                                        </button>
                                    </Tooltip>
                                </div>
                            </div>
                        </div>
                }

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
                    <div className="grid grid-cols-4 gap-4">
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
                        <Link href={'/your-collections'} className="text-center">
                            <p className="text-gray-600">Collections</p>
                            <p className="text-2xl font-bold">{user.collectionCount}</p>
                        </Link>
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