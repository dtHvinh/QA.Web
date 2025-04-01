'use client'

import { getFetcher } from "@/helpers/request-utils";
import { PagedResponse, QuestionResponse } from "@/types/types";
import { Delete, Edit, Flag, Lock, MoreVert, Visibility } from "@mui/icons-material";
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
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";

export default function QuestionsTable() {
    const [pageIndex, setPageIndex] = useState(1);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedQuestion, setSelectedQuestion] = useState<QuestionResponse | null>(null);
    
    const { data, isLoading } = useSWR<PagedResponse<QuestionResponse>>(
        `/api/moderator/questions?pageIndex=${pageIndex}&pageSize=10`,
        getFetcher
    );

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, question: QuestionResponse) => {
        setAnchorEl(event.currentTarget);
        setSelectedQuestion(question);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedQuestion(null);
    };

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setPageIndex(value);
    };

    const getStatusChip = (question: QuestionResponse) => {
        if (question.isClosed) {
            return <Chip size="small" label="Closed" color="error" />;
        }
        if (question.isSolved) {
            return <Chip size="small" label="Solved" color="success" />;
        }
        if (question.isDuplicate) {
            return <Chip size="small" label="Duplicate" color="warning" />;
        }
        return <Chip size="small" label="Open" color="info" />;
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-40">
                <div className="animate-pulse text-[var(--text-secondary)]">Loading questions...</div>
            </div>
        );
    }

    if (!data || data.items.length === 0) {
        return (
            <Paper className="p-8 text-center text-[var(--text-secondary)]">
                No questions found
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
                                <TableCell className="font-medium">Title</TableCell>
                                <TableCell className="font-medium">Author</TableCell>
                                <TableCell className="font-medium">Status</TableCell>
                                <TableCell className="font-medium">Date</TableCell>
                                <TableCell className="font-medium" align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.items.map((question) => (
                                <TableRow key={question.id} hover>
                                    <TableCell className="max-w-xs truncate">
                                        <Link 
                                            href={`/question/${question.id}/${question.slug}`}
                                            className="text-[var(--primary)] hover:underline"
                                        >
                                            {question.title}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200">
                                                {question.author?.profilePicture && (
                                                    <img 
                                                        src={question.author.profilePicture} 
                                                        alt={question.author.username}
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                            </div>
                                            <span>{question.author?.username}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{getStatusChip(question)}</TableCell>
                                    <TableCell>{new Date(question.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, question)}>
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
                    count={data?.totalPage || 1}
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
                    <Visibility fontSize="small" className="mr-2" />
                    View Question
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                    <Edit fontSize="small" className="mr-2" />
                    Edit Question
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                    <Lock fontSize="small" className="mr-2" />
                    Close Question
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                    <Flag fontSize="small" className="mr-2" />
                    Mark as Duplicate
                </MenuItem>
                <MenuItem onClick={handleMenuClose} className="text-red-500">
                    <Delete fontSize="small" className="mr-2" />
                    Delete Question
                </MenuItem>
            </Menu>
        </div>
    );
}