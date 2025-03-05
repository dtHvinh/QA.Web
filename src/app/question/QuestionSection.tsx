import AnswerSection from "@/app/question/AnswerSection";
import CommentSection from "@/app/question/CommentSection";
import EditSection from "@/app/question/EditSection";
import QuestionActions from "@/app/question/QuestionActions";
import QuestionContent from "@/app/question/QuestionContent";
import QuestionHeaderDetails from "@/app/question/QuestionHeaderDetails";
import TagLabel from "@/components/TagLabel";
import { formatReputation } from "@/helpers/evaluate-utils";
import { highlightCode } from "@/helpers/utils";
import { QuestionResponse } from "@/types/types";
import EditIcon from '@mui/icons-material/Edit';
import { Avatar, Dialog, DialogContent, DialogTitle, IconButton, Tooltip, useMediaQuery, useTheme } from "@mui/material";
import 'highlight.js/styles/atom-one-dark.css';
import React, { useEffect } from "react";

export default function QuestionSection({ questionInit }: { questionInit: QuestionResponse }) {
    const [isSolved, setIsSolved] = React.useState<boolean>(questionInit.isSolved);
    const [isClosed, setIsClosed] = React.useState<boolean>(questionInit.isClosed);
    const [isEditing, setIsEditing] = React.useState<boolean>(false);
    const [question, setQuestion] = React.useState<QuestionResponse>(questionInit);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

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

    const handleQuestionEdit = (question: QuestionResponse) => {
        setQuestion(question);
        setIsEditing(false);
    }

    return (
        <div className="max-w-5xl mx-auto">
            <Dialog
                fullScreen={fullScreen}
                open={isEditing}
                onClose={handleEditingClose}
                hideBackdrop={true}
                sx={{
                    '& .MuiDialog-paper': {
                        borderRadius: '12px',
                        maxWidth: '800px',
                        width: '100%'
                    }
                }}
            >
                <DialogTitle className="border-b">
                    <div className="font-semibold text-2xl">
                        Edit Question
                    </div>
                </DialogTitle>
                <DialogContent>
                    <EditSection question={question} onEditSuccess={handleQuestionEdit} />
                </DialogContent>
            </Dialog>

            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-1">
                    <QuestionActions
                        question={question}
                        onQuestionClose={handleQuestionClose}
                        className="md:sticky top-4"
                    />
                </div>

                <div className="col-span-11 space-y-6">
                    <div className="flex items-start justify-between">
                        <h1 className="text-2xl font-semibold text-gray-900">{question.title}</h1>
                        <Tooltip title="Edit this question" arrow>
                            <IconButton
                                onClick={handleEditClick}
                                className="hover:bg-gray-100"
                            >
                                <EditIcon className="text-gray-600" />
                            </IconButton>
                        </Tooltip>
                    </div>

                    <QuestionHeaderDetails  {...question} isSolved={isSolved} isClosed={isClosed} />

                    <div className="space-y-6">
                        <div className="prose max-w-none">
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

                        <div className="flex justify-end border-t pt-4">
                            <div className="flex items-center gap-4 bg-gray-50 rounded-lg p-4">
                                <div className="text-right">
                                    <div className="text-sm font-medium text-gray-900">
                                        {question.author.username}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Reputation: <span className="font-medium">
                                            {formatReputation(question.author.reputation)}
                                        </span>
                                    </div>
                                </div>
                                <Avatar
                                    sx={{ width: 40, height: 40 }}
                                    src={question.author.profilePicture}
                                    className="border-2 border-white shadow-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <CommentSection question={question} isClosed={isClosed} />
                        <AnswerSection
                            question={question}
                            isClosed={isClosed}
                            onAnswerAcceptAction={handleAnswerAcceptAction}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}