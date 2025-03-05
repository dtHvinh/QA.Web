'use client'

import Loading from "@/app/loading";
import ObjectNotfound from "@/components/Error/ObjectNotFound";
import ResourceOwnerPrivilege from "@/components/Privilege/ResourceOwnerPrivilege";
import getAuth from "@/helpers/auth-utils";
import { getFetcher, IsErrorResponse } from "@/helpers/request-utils";
import { countTotalDays } from "@/helpers/time-utils";
import { ExternalLinkResponse, UserResponse } from "@/types/types";
import { Edit } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import EditMode from "../EditMode";

export default function ProfilePage({ params }: { params: Promise<{ username?: string }> }) {
    const p = React.use(params);
    const auth = getAuth();
    const [isEditMode, setIsEditMode] = useState(false)
    const { data: user, isLoading } = useSWR<UserResponse>([`/api/user/${p.username ?? ''}`, auth?.accessToken], getFetcher);
    const [username, setUsername] = useState('')
    const [externalLinks, setExternalLinks] = useState<ExternalLinkResponse[]>([])

    useEffect(() => {
        if (user) {
            setUsername(user.username)
            setExternalLinks(user.externalLinks)
        }
    }, [user])

    if (!user || IsErrorResponse(user))
        return <ObjectNotfound title="User Not Found"
            message={`The username '${p.username}' you're looking for doesn't exist or has been removed.`} />

    if (isLoading)
        return <Loading />

    const handleLinkChange = (links: ExternalLinkResponse[]) => {
        setExternalLinks(links)
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            {isEditMode ? (
                <EditMode
                    onSocialLinksChange={handleLinkChange}
                    onUsernameChange={setUsername}
                    externalLinks={externalLinks}
                    onEditModeClick={() => setIsEditMode(false)}
                    profile={user} />
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-transparent h-32"></div>
                    <div className="px-6 pb-6 bg-gray-50">
                        <div className="flex flex-col sm:flex-row sm:items-end -mt-16 mb-6 gap-4">
                            <Avatar
                                variant="rounded"
                                src={auth?.profilePicture}
                                alt={user.username}
                                sx={{
                                    width: 120,
                                    height: 120,
                                    border: '4px solid white',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                            <div className="flex-grow mt-4 sm:mt-0">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                                    <h1 className="text-3xl font-bold text-gray-900">{username}</h1>
                                    <ResourceOwnerPrivilege resourceRight={user.resourceRight}>
                                        <button
                                            onClick={() => setIsEditMode(true)}
                                            className="mt-2 sm:mt-0 flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                        >
                                            <Edit fontSize="small" />
                                            <span>Edit Profile</span>
                                        </button>
                                    </ResourceOwnerPrivilege>
                                </div>
                                <div className="mt-2 text-gray-500">
                                    Member for {countTotalDays(user.dateJoined)} days
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Links:</h2>
                            <div className="flex flex-wrap gap-3 mt-4">
                                {externalLinks.length > 0 ?
                                    externalLinks.map((link) => (
                                        <Link
                                            key={link.id}
                                            href={link.url}
                                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                        >
                                            {link.provider}
                                        </Link>))
                                    : <div className="text-gray-400 italic">No links</div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Activity Summary</h2>
                    <div className="grid grid-cols-2 gap-6">
                        <Link href="/your-questions" className="bg-blue-50 rounded-xl p-4 hover:bg-blue-100 transition-colors">
                            <div className="flex flex-col items-center">
                                <span className="text-3xl font-bold text-blue-600">{user.questionCount}</span>
                                <span className="text-gray-600 mt-1">Questions</span>
                            </div>
                        </Link>
                        <div className="bg-green-50 rounded-xl p-4">
                            <div className="flex flex-col items-center">
                                <span className="text-3xl font-bold text-green-600">{user.answerCount}</span>
                                <span className="text-gray-600 mt-1">Answers</span>
                            </div>
                        </div>
                        <div className="bg-purple-50 rounded-xl p-4">
                            <div className="flex flex-col items-center">
                                <span className="text-3xl font-bold text-purple-600">{user.commentCount}</span>
                                <span className="text-gray-600 mt-1">Comments</span>
                            </div>
                        </div>
                        <Link href="/your-collections" className="bg-amber-50 rounded-xl p-4 hover:bg-amber-100 transition-colors">
                            <div className="flex flex-col items-center">
                                <span className="text-3xl font-bold text-amber-600">{user.collectionCount}</span>
                                <span className="text-gray-600 mt-1">Collections</span>
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">User Stats</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-700">Total Upvotes</span>
                            <span className="font-semibold text-gray-900">{user.totalUpvotes}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-700">Accepted Answers</span>
                            <span className="font-semibold text-gray-900">{user.acceptedAnswerCount}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}