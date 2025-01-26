import RoundedButton from "@/components/RoundedButton";
import TagLabel from "@/components/TagLabel";
import React from "react";
import {QuestionResponse} from "@/types/types";
import 'highlight.js/styles/github.css';
import QuestionHeaderDetails from "@/app/question/QuestionHeaderDetails";
import QuestionContent from "@/app/question/QuestionContent";
import QuestionSectionOptions from "@/app/question/QuestionSectionOptions";

export default function QuestionSection({question}: { question: QuestionResponse }) {

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
                    />
                    <div>{question.upvote - question.downvote}</div>
                    <RoundedButton
                        title={'Downvote'}
                        svg={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                  fill="currentColor"
                                  viewBox="0 0 16 16">
                            <path fillRule="evenodd"
                                  d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8"/>
                        </svg>}
                    />
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
                </div>
            </div>
        </div>
    );
}