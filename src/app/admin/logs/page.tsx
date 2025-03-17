'use client'

import Loading from "@/app/loading";
import AccessDenied from "@/components/Privilege/AccessDenied";
import AdminPrivilege from "@/components/Privilege/AdminPrivilege";
import getAuth from "@/helpers/auth-utils";
import { getFetcher, IsErrorResponse } from "@/helpers/request-utils";
import { PagedResponse, SysLogResponse } from "@/types/types";
import { ArrowBack } from "@mui/icons-material";
import { Pagination } from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";

export default function LogPage() {
    const auth = getAuth();
    const [pageIndex, setPageIndex] = useState(1);
    const { data, isLoading } = useSWR<PagedResponse<SysLogResponse>>(
        [`/api/admin/logs?pageIndex=${pageIndex}&pageSize=20`, auth?.accessToken],
        getFetcher
    );

    const getLevelColor = (level: string) => {
        switch (level.toLowerCase()) {
            case 'error': return 'text-red-500';
            case 'warning': return 'text-yellow-500';
            case 'information': return 'text-blue-500';
            default: return 'text-[var(--text-secondary)]';
        }
    };

    if (!data || isLoading) {
        return <Loading />;
    }

    if (IsErrorResponse(data)) {
        return <div>Error loading logs</div>;
    }

    console.log(data)

    return (
        <AdminPrivilege fallBackComponent={<AccessDenied />}>
            <div className="page-container mx-auto">
                <div className="bg-[var(--card-background)] rounded-xl shadow-sm border border-[var(--border-color)] overflow-hidden">
                    <div className="p-6 border-b border-[var(--border-color)]">
                        <div className="flex items-center gap-4 mb-4">
                            <Link
                                href="/admin"
                                className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-600"
                            >
                                <ArrowBack fontSize="small" />
                                <span>Back to Dashboard</span>
                            </Link>
                        </div>
                        <h1 className="text-xl font-bold text-[var(--text-primary)]">System Logs</h1>
                        <p className="mt-1 text-sm text-[var(--text-secondary)]">View and monitor system logs</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-[var(--hover-background)] text-left text-sm text-[var(--text-secondary)]">
                                    <th className="py-3 px-6 font-medium">Timestamp</th>
                                    <th className="py-3 px-6 font-medium">Level</th>
                                    <th className="py-3 px-6 font-medium">Message</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-color)]">
                                {data.items.map((log) => (
                                    <tr key={log.id} className="hover:bg-[var(--hover-background)] transition-colors">
                                        <td className="py-3 px-6 text-sm text-[var(--text-secondary)] whitespace-nowrap">
                                            {new Date(log.utcTimestamp).toLocaleString()}
                                        </td>
                                        <td className="py-3 px-6">
                                            <span className={`text-sm font-medium ${getLevelColor(log.level)}`}>
                                                {log.level}
                                            </span>
                                        </td>
                                        <td dangerouslySetInnerHTML={{ __html: log.message }} className="py-3 px-6 text-sm text-[var(--text-primary)]">
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t border-[var(--border-color)] flex justify-center">
                        <Pagination
                            count={data.totalPage}
                            page={pageIndex}
                            onChange={(_, value) => setPageIndex(value)}
                            color="primary"
                        />
                    </div>
                </div>
            </div>
        </AdminPrivilege>
    );
}