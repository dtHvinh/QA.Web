'use client'

import DeleteConfirmDialog from "@/components/Dialog/DeleteConfirmDialog";
import toQuestionDetail from "@/helpers/path";
import { deleteFetcher, getFetcher, IsErrorResponse, putFetcher } from "@/helpers/request-utils";
import { fromImage } from "@/helpers/utils";
import { PagedResponse, QuestionResponse } from "@/types/types";
import { notifyInfo, notifySucceed } from "@/utilities/ToastrExtensions";
import { Delete, Flag, FlagOutlined, InsertLink, Lock, MoreVert, RestoreFromTrash, Visibility } from "@mui/icons-material";
import {
    Avatar,
    Chip,
    IconButton,
    Menu,
    MenuItem,
    Pagination,
    Paper
} from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";

export default function QuestionsTable() {
    const [pageIndex, setPageIndex] = useState(1);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedQuestion, setSelectedQuestion] = useState<QuestionResponse | null>(null);
    const [deleteConfirmDialogOpen, setDeleteConfirmDialogOpen] = useState(false);

    const { data, isLoading, mutate } = useSWR<PagedResponse<QuestionResponse>>(
        `/api/mod/questions/all?pageIndex=${pageIndex}&pageSize=20`,
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

    const handleViewQuestion = () => {
        if (selectedQuestion) {
            window.open(toQuestionDetail(selectedQuestion.id, selectedQuestion.slug), '_blank');
        }
        handleMenuClose();
    };

    const handleCloseQuestion = async () => {

        handleMenuClose();
    };

    const handleMarkAsDuplicate = async () => {

        handleMenuClose();
    };

    const handleDeleteQuestion = async () => {
        if (selectedQuestion) {
            await deleteFetcher(`/api/mod/question/${selectedQuestion.id}`);
            mutate();
        }
        handleMenuClose();
    };

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setPageIndex(value);
    };

    const handleRestoreQuestion = async () => {
        if (selectedQuestion) {
            await putFetcher(`/api/mod/question/${selectedQuestion.id}/restore`);
            mutate();
        }
        handleMenuClose();
    }

    const handleFlagDuplicate = async () => {
        if (selectedQuestion) {
            const response = await putFetcher(`/api/question/duplicate`, JSON.stringify({
                duplicateUrl: '',
                questionId: selectedQuestion.id
            }));

            if (!IsErrorResponse(response)) {
                notifySucceed('Question marked as duplicate');
                handleMenuClose();
                mutate();
            }
        }
    }

    const handleRemoveDuplicateFlag = async () => {
        if (selectedQuestion) {
            const response = await putFetcher(`/api/question/${selectedQuestion.id}/remove-duplicate-flag`);

            if (!IsErrorResponse(response)) {
                notifySucceed('Question duplicate flag removed');
                handleMenuClose();
                mutate();
            }
        }
    }

    const getStatusChip = (question: QuestionResponse) => {
        if (question.isDeleted) {
            return <Chip size="small" label="Deleted" color="error" />;
        }
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

    const handleCopy = () => {
        if (selectedQuestion) {
            navigator.clipboard.writeText(toQuestionDetail(selectedQuestion.id, selectedQuestion.slug));
            notifyInfo("Copied to clipboard", { horizontal: 'center', vertical: 'bottom' });
        }
    }

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
            <div className="overflow-x-auto rounded-lg border border-[var(--border-color)] shadow-sm mb-6">
                <table className="min-w-full divide-y divide-[var(--border-color)]">
                    <thead className="bg-[var(--hover-background)]">
                        <tr>
                            <th className="px-6 py-2 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                                Id
                            </th>
                            <th className="px-6 py-2 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                                Title
                            </th>
                            <th className="px-6 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                                Author
                            </th>
                            <th className="px-6 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 text-right text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-[var(--card-background)] divide-y divide-[var(--border-color)]">
                        {data.items.map((question) => (
                            <tr
                                key={question.id}
                                className="hover:bg-[var(--hover-background)] transition-colors duration-150
                                [&>td]:px-6 [&>td]:py-2"
                            >
                                <td className="whitespace-nowrap text-sm text-[var(--text-primary)]">
                                    {question.id}
                                </td>
                                <td className="text-sm text-[var(--text-primary)] max-w-xs truncate">
                                    <Link
                                        href={`/question/${question.id}/${question.slug}`}
                                        className="text-[var(--text-primary)] hover:underline"
                                    >
                                        {question.title}
                                    </Link>
                                </td>
                                <td className="whitespace-nowrap text-sm text-[var(--text-primary)]">
                                    <div className="flex items-center gap-2">
                                        <div className="rounded-full overflow-hidden bg-gray-200">
                                            {question.author?.profilePicture && (
                                                <Avatar
                                                    src={fromImage(question.author.profilePicture)}
                                                    alt={question.author.username}
                                                    className="object-cover"
                                                    sx={{ width: 26, height: 26 }}
                                                />
                                            )}
                                        </div>
                                        <span>{question.author?.username}</span>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap text-sm">
                                    {getStatusChip(question)}
                                </td>
                                <td className="whitespace-nowrap text-sm text-[var(--text-primary)]">
                                    {new Date(question.createdAt).toLocaleDateString()}
                                </td>
                                <td className="whitespace-nowrap text-right text-sm font-medium">
                                    <IconButton size="small" onClick={(e) => handleMenuOpen(e, question)}>
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
                sx={{
                    '& .MuiPaper-root': {
                        backgroundColor: 'var(--card-background)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-color)',
                        boxShadow: 'none',
                        borderRadius: '8px',
                    },
                }}
            >
                <MenuItem onClick={handleViewQuestion}>
                    <Visibility fontSize="small" className="mr-2" />
                    View Question
                </MenuItem>
                <MenuItem onClick={handleCopy}>
                    <InsertLink fontSize="small" className="mr-2" />
                    Copy Url
                </MenuItem>
                <MenuItem onClick={handleCloseQuestion}>
                    <Lock fontSize="small" className="mr-2" />
                    Close Question
                </MenuItem>
                {selectedQuestion?.isDuplicate ?
                    <MenuItem onClick={handleRemoveDuplicateFlag}>
                        <Flag fontSize="small" className="mr-2" />
                        Remove duplicate mark
                    </MenuItem>
                    :
                    <MenuItem sx={{ display: 'block', width: '100%', padding: '8px 16px' }}>
                        <div className="flex items-center mb-2">
                            <FlagOutlined fontSize="small" className="mr-2" />
                            Mark as Duplicate
                        </div>
                        <form onSubmit={handleFlagDuplicate}>
                            <input
                                type="text"
                                className="w-full border border-[var(--border-color)] rounded-md px-3 py-1.5 text-sm
                                bg-[var(--input-background)] text-[var(--text-primary)]
                                focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
                                placeholder="Enter duplicate question URL"
                            />
                        </form>
                    </MenuItem>
                }
                {selectedQuestion?.isDeleted ?
                    <MenuItem onClick={handleRestoreQuestion} className="text-red-500">
                        <RestoreFromTrash fontSize="small" className="mr-2" />
                        Restore Question
                    </MenuItem>
                    :
                    <MenuItem onClick={() => setDeleteConfirmDialogOpen(true)} className="text-red-500">
                        <Delete fontSize="small" className="mr-2" />
                        Delete Question
                    </MenuItem>
                }
            </Menu>

            <DeleteConfirmDialog
                itemType="question"
                open={deleteConfirmDialogOpen}
                onClose={() => setDeleteConfirmDialogOpen(false)}
                onConfirm={handleDeleteQuestion}
            />
        </div>
    );
}