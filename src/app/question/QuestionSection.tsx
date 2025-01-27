import RoundedButton from "@/components/RoundedButton";
import TagLabel from "@/components/TagLabel";
import React from "react";
import {QuestionResponse, VoteResponse} from "@/types/types";
import 'highlight.js/styles/github.css';
import QuestionHeaderDetails from "@/app/question/QuestionHeaderDetails";
import QuestionContent from "@/app/question/QuestionContent";
import QuestionSectionOptions from "@/app/question/QuestionSectionOptions";
import {Avatar} from "@mui/material";
import notifyError, {notifyInfo, notifySucceed} from "@/utilities/ToastrExtensions";
import {backendURL} from "@/utilities/Constants";
import getAuth from "@/helpers/auth-utils";
import {IsErrorResponse, postFetcher} from "@/helpers/request-utils";
import {ErrorResponse} from "@/props/ErrorResponse";

export default function QuestionSection({question}: { question: QuestionResponse }) {
    const auth = getAuth();
    const [currentVote, setCurrentVote] = React.useState<number>(question.upvote - question.downvote);

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            notifyInfo('Link copied to clipboard');
        } catch {
            notifyError('Failed to copy link');
        }
    }

    const handleVote = async (isUpvote: boolean) => {
        const requestUrl = `${backendURL}/api/question/${question.id}/${isUpvote ? 'upvote' : 'downvote'}/`;

        const response = await postFetcher([requestUrl, auth!.accessToken, '']);

        if (IsErrorResponse(response)) {
            notifyError((response as ErrorResponse).title);
        } else {
            notifySucceed('Done');
            const voteResponse = response as VoteResponse;
            setCurrentVote(voteResponse.currentUpvote - voteResponse.currentDownvote);
        }
    }

    return (
        <div>
            <div className={'grid grid-cols-12'}>
                <div
                    className={'col-span-1 row-span-full justify-items-center space-y-3'}>
                    <RoundedButton
                        title={'Upvote'}
                        svg={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                  fill="currentColor"
                                  viewBox="0 0 16 16">
                            <path fillRule="evenodd"
                                  d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                        </svg>}
                        onClick={() => handleVote(true)}
                    />
                    <div>{currentVote}</div>
                    <RoundedButton
                        title={'Downvote'}
                        svg={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                  fill="currentColor"
                                  viewBox="0 0 16 16">
                            <path fillRule="evenodd"
                                  d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8"/>
                        </svg>}
                        onClick={() => handleVote(false)}
                    />
                    <div>
                        <RoundedButton
                            title={'Share'}
                            onClick={handleShare}
                            svg={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                      className="bi bi-share" viewBox="0 0 16 16">
                                <path
                                    d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5m-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3"/>
                            </svg>}
                        />
                    </div>
                    <div>
                        <QuestionSectionOptions question={question}/>
                    </div>
                </div>

                <div className={'col-span-9 row-span-full'}>
                    <div className={'text-2xl'}>
                        {question.title}
                    </div>
                    <QuestionHeaderDetails question={question}/>

                    <div className={'mt-5'}>
                        <QuestionContent content={question.content}/>

                        <div className={'mt-2'}>
                            <div className={'text-gray-500  flex flex-wrap gap-2'}>
                                {question.tags?.map(tag => <TagLabel key={tag.id}
                                                                     name={tag.name}
                                                                     description={tag.description}/>
                                )}
                            </div>
                        </div>
                    </div>

                    <hr className={'mt-5'}/>

                    <div className={'flex justify-end'}>

                        <div className={'p-4 gap-4 flex'}>
                            <div>
                                <div className={'text-gray-500'}>
                                    {question.author.username}
                                </div>
                                <div className={'text-gray-500'}>
                                    Reputation: {question.author.reputation}
                                </div>
                            </div>
                            <div>
                                <Avatar sx={{width: 42, height: 42}} src={question.author.profilePicture}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}