import TagLabel from "@/components/TagLabel";
import React, {useEffect} from "react";
import {QuestionResponse} from "@/types/types";
import 'highlight.js/styles/atom-one-dark.css';
import QuestionHeaderDetails from "@/app/question/QuestionHeaderDetails";
import QuestionContent from "@/app/question/QuestionContent";
import {Avatar, Dialog, DialogContent, DialogTitle, IconButton} from "@mui/material";
import CommentSection from "@/app/question/CommentSection";
import AnswerSection from "@/app/question/AnswerSection";
import {highlightCode} from "@/helpers/utils";
import EditIcon from '@mui/icons-material/Edit';
import EditSection from "@/app/question/EditSection";
import QuestionInteractivity from "@/app/question/QuestionInteractivity";
import {formatReputation} from "@/helpers/evaluate-utils";
import ResourceOwnerPrivilege from "@/components/ResourceOwnerPrivilege";

export default function QuestionSection({questionInit}: { questionInit: QuestionResponse }) {
    const [isSolved, setIsSolved] = React.useState<boolean>(questionInit.isSolved);
    const [isClosed, setIsClosed] = React.useState<boolean>(questionInit.isClosed);
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

    const handleQuestionEdit = (question: QuestionResponse) => {
        setQuestion(question);
        setIsEditing(false);
    }

    return (
        <div>
            <Dialog
                open={isEditing}
                onClose={handleEditingClose}
                hideBackdrop={true}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                </DialogTitle>
                <DialogContent>
                    <EditSection question={question} onEditSuccess={handleQuestionEdit}/>
                </DialogContent>
            </Dialog>

            <div className={'grid grid-cols-12'}>

                <QuestionInteractivity question={question}
                                       onQuestionClose={handleQuestionClose}/>

                <div className={'col-span-12 row-span-full'}>
                    <div className={'flex justify-between text-2xl'}>
                        <div>{question.title}</div>
                        <ResourceOwnerPrivilege resourceRight={question.resourceRight}>
                            <div>
                                <IconButton onClick={handleEditClick}>
                                    <EditIcon/>
                                </IconButton>
                            </div>
                        </ResourceOwnerPrivilege>
                    </div>

                    <QuestionHeaderDetails {...question}
                                           isSolved={isSolved}
                                           isClosed={isClosed}/>

                    <div className={'mt-5'}>
                        <QuestionContent content={question.content}/>

                        <div className={'mt-2'}>
                            <div className={'text-gray-500  flex flex-wrap gap-2'}>
                                {question.tags?.map(tag =>
                                    <TagLabel key={tag.id}
                                              name={tag.name}
                                              description={tag.description}/>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={'flex justify-end'}>

                        <div className={'p-4 gap-4 flex text-sm items-center'}>
                            <div>
                                <div className={'text-gray-500'}>
                                    {question.author.username}
                                </div>
                                <div className={'text-gray-500'}>
                                    Reputation: <span
                                    className={'font-bold'}>{formatReputation(question.author.reputation)}</span>
                                </div>
                            </div>
                            <div>
                                <Avatar sx={{width: 32, height: 32}} src={question.author.profilePicture}/>
                            </div>
                        </div>
                    </div>

                    <div>
                        <CommentSection question={question}
                                        isClosed={isClosed}/>
                    </div>

                    <div className={'mt-5'}>
                        <AnswerSection question={question}
                                       isClosed={isClosed}
                                       onAnswerAcceptAction={handleAnswerAcceptAction}/>
                    </div>
                </div>
            </div>
        </div>
    );
}