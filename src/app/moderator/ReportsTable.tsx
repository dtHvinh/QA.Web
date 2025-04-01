'use client'

import { getFetcher } from "@/helpers/request-utils";
import { GetReportResponse, PagedResponse } from "@/types/types";
import { Check, Close, MoreVert } from "@mui/icons-material";
import {
    Chip,
    IconButton,
    Menu,
    MenuItem,
    Pagination,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import { useState } from "react";
import useSWR from "swr";

export default function ReportsTable() {
    const [pageIndex, setPageIndex] = useState(1);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedReport, setSelectedReport] = useState<GetReportResponse | null>(null);

    const { data, isLoading, mutate } = useSWR<PagedResponse<GetReportResponse>>(
        `/api/report/all?pageIndex=${pageIndex}&pageSize=20`,
        getFetcher
    );

    console.log(data);
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
            <Paper className="mb-6">
                <TableContainer>
                    <Table>
                        <TableHead className="bg-[var(--hover-background)]">
                            <TableRow>
                                <TableCell className="font-medium">Type</TableCell>
                                <TableCell className="font-medium">Description</TableCell>
                                <TableCell className="font-medium">Status</TableCell>
                                <TableCell className="font-medium">Date</TableCell>
                                <TableCell className="font-medium" align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.items.map((report) => (
                                <TableRow key={report.id} hover>
                                    <TableCell>{report.type}</TableCell>
                                    <TableCell className="max-w-xs truncate">{report.description}</TableCell>
                                    <TableCell>{getStatusChip(report.status)}</TableCell>
                                    <TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, report)}>
                                            <MoreVert fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

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