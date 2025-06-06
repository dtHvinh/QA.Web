'use client'

import UserActionPanel from "@/components/Admin/UserActionPanel";
import ObjectNotfound from "@/components/Error/ObjectNotFound";
import AccessDenied from "@/components/Privilege/AccessDenied";
import AdminPrivilege from "@/components/Privilege/AdminPrivilege";
import { getFetcher, IsErrorResponse } from "@/helpers/request-utils";
import { fromImage } from "@/helpers/utils";
import { GetUserResponse, PagedResponse } from "@/types/types";
import { ArrowBack } from "@mui/icons-material";
import { Avatar, Pagination, Tooltip } from "@mui/material";
import Link from "next/link";
import React, { FormEvent, useEffect, useState } from "react";
import useSWR from "swr";
import UserStatus from "../UserStatus";

export default function UserManagementPage() {
    const [pageIndex, setPageIndex] = useState(1);
    const [expandedUserId, setExpandedUserId] = useState<number | null>(null);
    const [searchId, setSearchId] = useState('');
    const [cachedUsers, setCachedUsers] = useState<GetUserResponse[]>([])
    const { data, isLoading } = useSWR<PagedResponse<GetUserResponse>>(`/api/admin/users?pageIndex=${pageIndex}&pageSize=10`, getFetcher);
    const [users, setUsers] = useState<GetUserResponse[]>([])

    useEffect(() => {
        if (data) {
            setUsers(data.items)
            setCachedUsers(data.items)
        }
    }, [data])

    if (!isLoading && IsErrorResponse(data)) {
        return <ObjectNotfound title="No users found" message="" />
    }

    if (!data) {
        return null;
    }

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setPageIndex(value);
    }

    const handleUserBanned = (userId: number) => {
        setUsers(prevUsers => prevUsers.map(
            user => user.id === userId ? { ...user, isBanned: true } : user))
    }

    const handleUserUnban = (userId: number) => {
        setUsers(prevUsers => prevUsers.map(
            user => user.id === userId ? { ...user, isBanned: false } : user))
    }

    const handleSearchUserById = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!searchId) {
            setUsers(cachedUsers)
            return;
        }

        const res = await getFetcher(`/api/admin/users/${searchId}`);

        if (!IsErrorResponse(res)) {
            setUsers([res as GetUserResponse])
        }
    }

    return (
        <AdminPrivilege fallBackComponent={<AccessDenied />}>
            <div className="page-container mx-auto p-3 sm:p-6">
                <div className="bg-[var(--card-background)] rounded-xl shadow-sm border border-[var(--border-color)] overflow-hidden">
                    <div className="p-4 sm:p-6 border-b border-[var(--border-color)]">
                        <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                            <Link
                                href="/admin"
                                className="inline-flex items-center gap-1 text-sm sm:text-base text-blue-500 hover:text-blue-600"
                            >
                                <ArrowBack fontSize="small" />
                                <span>Back to Dashboard</span>
                            </Link>
                        </div>
                        <h1 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">User Management</h1>
                        <p className="mt-1 text-xs sm:text-sm text-[var(--text-secondary)]">Manage and monitor user accounts</p>
                    </div>

                    <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-[var(--border-color)]">
                        <div className="max-w-xs w-full">
                            <form onSubmit={handleSearchUserById}>
                                <input
                                    type="text"
                                    placeholder="Search user by Id"
                                    value={searchId}
                                    onChange={(e) => setSearchId(e.target.value)}
                                    className="w-full px-3 sm:px-4 py-2 border border-[var(--border-color)] rounded-lg text-xs sm:text-sm bg-[var(--input-bg)] text-[var(--text-primary)]"
                                />
                            </form>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-[800px] w-full">
                            <thead>
                                <tr className="bg-[var(--hover-background)] text-left text-xs sm:text-sm text-[var(--text-secondary)]">
                                    <th className="py-2 sm:py-3 px-3 sm:px-6 font-medium">ID</th>
                                    <th className="py-2 sm:py-3 px-3 sm:px-6 font-medium">User</th>
                                    <th className="py-2 sm:py-3 px-3 sm:px-6 font-medium">Email</th>
                                    <th className="py-2 sm:py-3 px-3 sm:px-6 font-medium">Reputation</th>
                                    <th className="py-2 sm:py-3 px-3 sm:px-6 font-medium">Status</th>
                                    <th className="py-2 sm:py-3 px-3 sm:px-6 font-medium">Joined</th>
                                    <th className="py-2 sm:py-3 px-3 sm:px-6 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-color)]">
                                {data && users.map((user) => (
                                    <React.Fragment key={user.id} >
                                        <tr className="hover:bg-[var(--hover-background)] transition-colors">
                                            <td className="py-2 sm:py-3 px-3 sm:px-6 text-xs sm:text-sm text-[var(--text-secondary)]">
                                                {user.id}
                                            </td>
                                            <td className="py-2 sm:py-3 px-3 sm:px-6">
                                                <div className="flex items-center gap-2 sm:gap-3">
                                                    <Avatar
                                                        src={fromImage(user.profilePicture)}
                                                        alt={user.userName}
                                                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
                                                    />
                                                    <div>
                                                        <div className="text-xs sm:text-sm font-medium text-[var(--text-primary)]">
                                                            {user.userName}
                                                        </div>
                                                        <div className="text-xs sm:text-sm text-[var(--text-secondary)]">
                                                            {user.firstName} {user.lastName}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-2 sm:py-3 px-3 sm:px-6 text-xs sm:text-sm text-[var(--text-secondary)] max-w-40 sm:max-w-60 truncate">
                                                <Tooltip title={user.email}>
                                                    <span>{user.email}</span>
                                                </Tooltip>
                                            </td>
                                            <td className="py-2 sm:py-3 px-3 sm:px-6">
                                                <span className="text-xs sm:text-sm font-medium text-[var(--text-primary)]">
                                                    {user.reputation}
                                                </span>
                                            </td>
                                            <td className="py-2 sm:py-3 px-3 sm:px-6">
                                                <UserStatus user={user} />
                                            </td>
                                            <td className="py-2 sm:py-3 px-3 sm:px-6 text-xs sm:text-sm text-[var(--text-secondary)]">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="py-2 sm:py-3 px-3 sm:px-6">
                                                <button
                                                    onClick={() => setExpandedUserId(expandedUserId === user.id ? null : user.id)}
                                                    className={`text-xs sm:text-sm ${expandedUserId === user.id ? 'text-[var(--primary-dark)]' : 'text-[var(--primary)] hover:text-[var(--primary-dark)]'}`}
                                                >
                                                    {expandedUserId === user.id ? 'Close' : 'Edit'}
                                                </button>
                                            </td>
                                        </tr>
                                        {expandedUserId === user.id && (
                                            <tr>
                                                <UserActionPanel
                                                    user={user}
                                                    colSpan={7}
                                                    onUserBanned={handleUserBanned}
                                                    onUserUnban={handleUserUnban} />
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {data && data.totalPage > 0 && (
                        <div className="flex justify-center py-4 sm:py-6 border-t border-[var(--border-color)]">
                            <Pagination
                                count={data.totalPage}
                                page={pageIndex}
                                onChange={handlePageChange}
                                shape="rounded"
                                size="small"
                            />
                        </div>
                    )}
                </div>
            </div>
        </AdminPrivilege>
    );
}