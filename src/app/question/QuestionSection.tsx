import AnswerSection from "@/app/question/AnswerSection";
import CommentSection from "@/app/question/CommentSection";
import EditSection from "@/app/question/EditSection";
import QuestionActions from "@/app/question/QuestionActions";
import QuestionContent from "@/app/question/QuestionContent";
import QuestionHeaderDetails from "@/app/question/QuestionHeaderDetails";
import ResourceOwnerPrivilege from "@/components/Privilege/ResourceOwnerPrivilege";
import TagLabel from "@/components/TagLabel";
import { formatReputation } from "@/helpers/evaluate-utils";
import { fromImage, highlightCode } from "@/helpers/utils";
import { QuestionResponse } from "@/types/types";
import EditIcon from '@mui/icons-material/Edit';
import { Avatar, Dialog, DialogContent, IconButton, Tooltip } from "@mui/material";
import 'highlight.js/styles/atom-one-dark.css';
import React, { useEffect } from "react";

export default function QuestionSection({ questionInit }: { questionInit: QuestionResponse }) {
    const [isSolved, setIsSolved] = React.useState<boolean>(questionInit.isSolved);
    const [isClosed, setIsClosed] = React.useState<boolean>(questionInit.isClosed);
    const [isDuplicated, setIsDuplicated] = React.useState<boolean>(questionInit.isDuplicate);
    const [isEditing, setIsEditing] = React.useState<boolean>(false);
    const [question, setQuestion] = React.useState<QuestionResponse>(questionInit);

    const handleEditClick = () => {
        setIsEditing(!isEditing);
    }

    useEffect(() => {
        highlightCode();
    }, [question.content]);

    const handleEditingClose = () => {
        setIsEditing(false);
    }

    const handleAnswerAcceptAction = (answerId: string) => {
        setIsSolved(true);
    }

    const handleQuestionClose = () => {
        setIsClosed(true);
    }

    const handleQuestionReopen = () => {
        setIsClosed(false);
    }

    const handleSetDuplicated = () => {
        setIsDuplicated(true);
    }

    const handleQuestionEdit = (question: QuestionResponse) => {
        setQuestion(question);
        setIsEditing(false);
    }

    return (
        <div className="page-container mx-auto">
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-1">
                    <QuestionActions
                        isDuplicated={isDuplicated}
                        question={question}
                        isClosed={isClosed}
                        onQuestionClose={handleQuestionClose}
                        onQuestionReopen={handleQuestionReopen}
                        onSetDuplicated={handleSetDuplicated}
                        className="md:sticky top-4"
                    />
                </div>

                <div className="col-span-11 space-y-6">
                    <div className="flex items-start justify-between">
                        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">{question.title}</h1>
                        <ResourceOwnerPrivilege resourceRight={question.resourceRight}>
                            <Tooltip title="Edit this question" arrow>
                                <IconButton onClick={handleEditClick}>
                                    <EditIcon fontSize="medium" className="text-[var(--text-secondary)] hover:bg-[var(--hover-background)] rounded-full" />
                                </IconButton>
                            </Tooltip>
                        </ResourceOwnerPrivilege>
                    </div>

                    <QuestionHeaderDetails {...question} isSolved={isSolved} isClosed={isClosed} />

                    <div className="space-y-6">
                        <div className="prose max-w-none dark:prose-invert">
                            <QuestionContent content={question.content} />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {question.tags?.map(tag => (
                                <TagLabel
                                    key={tag.id}
                                    name={tag.name}
                                    description={tag.description}
                                />
                            ))}
                        </div>

                        <div className="flex justify-end border-t border-[var(--border-color)] pt-4">
                            <div className="flex items-center gap-4 bg-[var(--hover-background)] rounded-lg p-4">
                                <div className="text-right">
                                    <div className="text-sm font-medium text-[var(--text-primary)]">
                                        {question.author.username}
                                    </div>
                                    <div className="text-sm text-[var(--text-secondary)]">
                                        Reputation: <span className="font-medium">
                                            {formatReputation(question.author.reputation)}
                                        </span>
                                    </div>
                                </div>
                                <Avatar
                                    sx={{ width: 40, height: 40 }}
                                    src={fromImage(question.author.profilePicture)}
                                    className="border-2 border-[var(--card-background)] shadow-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <CommentSection question={question} isClosed={isClosed} />
                        <AnswerSection
                            question={question}
                            isClosed={isClosed}
                            onAnswerAcceptAction={handleAnswerAcceptAction}
                        />
                    </div>
                </div>
            </div>

            <Dialog
                fullScreen={true}
                open={isEditing}
                onClose={handleEditingClose}
                hideBackdrop={true}
                sx={{
                    '& .MuiDialog-paper': {
                        maxWidth: 'none',
                        backgroundColor: 'var(--card-background)',
                        color: 'var(--text-primary)'
                    }
                }}
            >
                <DialogContent>
                    <EditSection question={question}
                        onEditSuccess={handleQuestionEdit}
                        onClose={handleEditingClose} />
                </DialogContent>
            </Dialog>
        </div>
    );
}