'use client'

import Loading from "@/app/loading";
import ActionButton from "@/components/Button/ActionButton";
import ObjectNotfound from "@/components/Error/ObjectNotFound";
import ResourceOwnerPrivilege from "@/components/Privilege/ResourceOwnerPrivilege";
import { getFetcher, IsErrorResponse } from "@/helpers/request-utils";
import { countTotalDays } from "@/helpers/time-utils";
import { fromImage, getProviderImage } from "@/helpers/utils";
import { ExternalLinkResponse, UserResponse } from "@/types/types";
import { Avatar } from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import EditMode from "../EditMode";

export const getUserProfileKey = (username?: string) => `/api/user/${username ?? ''}`

export default function ProfilePage({ params }: { params: Promise<{ username?: string }> }) {
    const p = React.use(params);
    const [isEditMode, setIsEditMode] = useState(false)
    const { data: user, isLoading, mutate } = useSWR<UserResponse>(getUserProfileKey(p.username), getFetcher);
    const [username, setUsername] = useState('')
    const [externalLinks, setExternalLinks] = useState<ExternalLinkResponse[]>([])

    useEffect(() => {
        if (user) {
            setUsername(user.userName)
            setExternalLinks(user.externalLinks)
        }
    }, [user])

    if (!isLoading && IsErrorResponse(user))
        return <ObjectNotfound title="User Not Found"
            message={`The username '${p.username}' you're looking for doesn't exist or has been removed.`} />

    if (isLoading)
        return <Loading />

    const handleLinkChange = (links: ExternalLinkResponse[]) => {
        setExternalLinks(links)
    }

    const handlePfpChanged = (pfp: string) => {
        if (user) {
            mutate({
                ...user,
                profilePicture: pfp
            })
        }
    }

    return (
        user &&
        <div className="max-w-4xl mx-auto py-8 px-4">
            {isEditMode ? (
                <EditMode
                    onSocialLinksChange={handleLinkChange}
                    onUsernameChange={setUsername}
                    externalLinks={externalLinks}
                    onProfilePictureChange={handlePfpChanged}
                    onEditModeClick={() => setIsEditMode(false)}
                    profile={user} />
            ) : (
                <div className="bg-[var(--card-background)] rounded-xl shadow-sm border border-[var(--border-color)] overflow-hidden">
                    <div className="bg-transparent h-32"></div>
                    <div className="px-6 pb-6">
                        <div className="flex flex-col sm:flex-row sm:items-end -mt-16 mb-6 gap-4">
                            <Avatar
                                src={fromImage(user.profilePicture)}
                                sx={{
                                    width: 120,
                                    height: 120,
                                    color: 'var(--text-primary)',
                                    border: '4px solid var(--card-background)',
                                    backgroundColor: 'var(--hover-background)',
                                    boxShadow: 'var(--shadow-sm)'
                                }}
                            />
                            <div className="flex-grow mt-4 sm:mt-0">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                                    <h1 className="text-3xl font-bold text-[var(--text-primary)]">{username}</h1>
                                    <ResourceOwnerPrivilege resourceRight={user.resourceRight}>
                                        <ActionButton
                                            onClick={() => setIsEditMode(true)}
                                            kind='edit'
                                        />
                                    </ResourceOwnerPrivilege>
                                </div>
                                <div className="mt-2 text-[var(--text-secondary)]">
                                    Member for {countTotalDays(user.creationDate)}
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Links:</h2>
                            <div className="flex flex-wrap gap-3 mt-4">
                                {externalLinks.length > 0 ?
                                    externalLinks.map((link) => (
                                        <Link
                                            key={link.id}
                                            href={link.url}
                                            target="_blank"
                                            className="flex items-center gap-2 px-4 py-2 bg-[var(--hover-background-darker)] text-[var(--text-primary)] rounded-lg"
                                        >
                                            <Avatar src={getProviderImage(link.url)} sx={{ width: 16, height: 16 }} />
                                            <span className="truncate">{link.url}</span>
                                        </Link>))
                                    : <div className="text-[var(--text-tertiary)] italic">No links</div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-[var(--card-background)] rounded-xl shadow-sm border border-[var(--border-color)] p-6">
                    <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">Activity Summary</h2>
                    <div className="grid grid-cols-2 gap-6">
                        <Link href="/your-questions" className="bg-[var(--primary-light)] rounded-xl p-4 hover:bg-[var(--primary-lighter)] transition-colors">
                            <div className="flex flex-col items-center">
                                <span className="text-3xl font-bold text-[var(--primary)]">{user.questionCount}</span>
                                <span className="text-[var(--text-primary)] mt-1">Questions</span>
                            </div>
                        </Link>
                        <div className="bg-[var(--success-light)] rounded-xl p-4">
                            <div className="flex flex-col items-center">
                                <span className="text-3xl font-bold text-[var(--success)]">{user.answerCount}</span>
                                <span className="text-black mt-1">Answers</span>
                            </div>
                        </div>
                        <div className="bg-[var(--secondary-light)] rounded-xl p-4">
                            <div className="flex flex-col items-center">
                                <span className="text-3xl font-bold text-[var(--secondary)]">{user.commentCount}</span>
                                <span className="text-black mt-1">Comments</span>
                            </div>
                        </div>
                        <Link href="/your-collections" className="bg-[var(--warning-light)] rounded-xl p-4 hover:bg-[var(--warning-lighter)] transition-colors">
                            <div className="flex flex-col items-center">
                                <span className="text-3xl font-bold text-[var(--warning)]">{user.collectionCount}</span>
                                <span className="text-black mt-1">Collections</span>
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="bg-[var(--card-background)] rounded-xl shadow-sm border border-[var(--border-color)] p-6">
                    <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">User Stats</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-[var(--hover-background)] rounded-lg">
                            <span className="text-[var(--text-primary)]">Total Upvotes</span>
                            <span className="font-semibold text-[var(--text-primary)]">{user.totalScore}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-[var(--hover-background)] rounded-lg">
                            <span className="text-[var(--text-primary)]">Accepted Answers</span>
                            <span className="font-semibold text-[var(--text-primary)]">{user.acceptedAnswerCount}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}