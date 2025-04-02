'use client'

import { getFetcher } from "@/helpers/request-utils";
import { GetReportResponse, PagedResponse } from "@/types/types";
import { notifyInfo } from "@/utilities/ToastrExtensions";
import { Check, Close, CopyAllTwoTone, MoreVert } from "@mui/icons-material";
import {
    Chip,
    IconButton,
    Menu,
    MenuItem,
    Pagination,
    Paper,
    Tooltip
} from "@mui/material";
import { useState } from "react";
import useSWR from "swr";

export default function ReportsTable() {
    const [pageIndex, setPageIndex] = useState(1);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedReport, setSelectedReport] = useState<GetReportResponse | null>(null);

    const { data, isLoading, mutate } = useSWR<PagedResponse<GetReportResponse>>(
        `/api/mod/reports/?pageIndex=${pageIndex}&pageSize=20`,
        getFetcher
    );

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, report: GetReportResponse) => {
        setAnchorEl(event.currentTarget);
        setSelectedReport(report);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedReport(null);
    };

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setPageIndex(value);
    };

    const getStatusChip = (status: string) => {
        switch (status) {
            case 'Pending':
                return <Chip size="small" label="Pending" color="warning" />;
            case 'Resolved':
                return <Chip size="small" label="Resolved" color="success" />;
            case 'Rejected':
                return <Chip size="small" label="Rejected" color="error" />;
            default:
                return <Chip size="small" label={status} />;
        }
    };

    const handleCopyId = (report: GetReportResponse) => {
        navigator.clipboard.writeText(report.targetId.toString());
        notifyInfo('Copied to clipboard', { horizontal: 'center', vertical: 'top' }, 0.5);
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-40">
                <div className="animate-pulse text-[var(--text-secondary)]">Loading reports...</div>
            </div>
        );
    }

    if (!data || data.items.length === 0) {
        return (
            <Paper className="p-8 text-center text-[var(--text-secondary)]">
                No reports found
            </Paper>
        );
    }

    return (
        <div>
            <div className="overflow-x-auto rounded-lg border border-[var(--border-color)] shadow-sm">
                <table className="min-w-full divide-y divide-[var(--border-color)]">
                    <thead className="bg-[var(--hover-background)]">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                                Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                                Target Id
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                                Description
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-[var(--card-background)] divide-y divide-[var(--border-color)]">
                        {data.items.map((report) => (
                            <tr
                                key={report.id}
                                className="hover:bg-[var(--hover-background)] transition-colors duration-150 
                                [&_td]:py-2 [&_td]:px-6"
                            >
                                <td className="whitespace-nowrap text-sm text-[var(--text-primary)]">
                                    {report.type}
                                </td>
                                <td className="whitespace-nowrap text-sm text-[var(--text-primary)]">
                                    <div className="justify-between flex">
                                        {report.targetId}
                                        <Tooltip title="Click to copy">
                                            <CopyAllTwoTone fontSize="small" className="ml-2 text-[var(--text-secondary)] cursor-pointer" onClick={() => handleCopyId(report)} />
                                        </Tooltip>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap text-sm text-[var(--text-primary)] max-w-xs truncate">
                                    {report.description}
                                </td>
                                <td className="whitespace-nowrap text-sm">
                                    {getStatusChip(report.status)}
                                </td>
                                <td className="whitespace-nowrap text-sm text-[var(--text-primary)]">
                                    {new Date(report.createdAt).toLocaleString()}
                                </td>
                                <td className="whitespace-nowrap text-right text-sm font-medium">
                                    <IconButton size="small" onClick={(e) => handleMenuOpen(e, report)}>
                                        <MoreVert fontSize="small" className="text-[var(--text-primary)]" />
                                    </IconButton>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center mt-4">
                <Pagination
                    count={data.totalPage}
                    page={pageIndex}
                    onChange={handlePageChange}
                    color="primary"
                />
            </div>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleMenuClose}>
                    <Check fontSize="small" className="mr-2" />
                    Mark as Resolved
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                    <Close fontSize="small" className="mr-2" />
                    Reject Report
                </MenuItem>
            </Menu>
        </div>
    );
}