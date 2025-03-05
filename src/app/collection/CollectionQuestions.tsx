import getAuth from "@/helpers/auth-utils";
import { getFetcher, IsErrorResponse } from "@/helpers/request-utils";
import { ErrorResponse } from "@/props/ErrorResponse";
import { GetCollectionDetailResponse, QuestionResponse, ResourceRight } from "@/types/types";
import { backendURL } from "@/utilities/Constants";
import notifyError from "@/utilities/ToastrExtensions";
import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { useDebounce } from "use-debounce";
import CollectionQuestionItem from "./CollectionQuestionItem";

export default function CollectionQuestions({ collectionId, questionInit, pageIndex, pageSize, resourceRight }: {
    collectionId: string,
    questionInit: QuestionResponse[],
    pageIndex: number,
    pageSize: number,
    resourceRight: ResourceRight
}) {
    const requestUrl = `/api/collection/${collectionId}/?pageIndex=${pageIndex}&pageSize=${pageSize}`;
    const auth = getAuth();
    const { data } = useSWR<GetCollectionDetailResponse>([requestUrl, auth?.accessToken], getFetcher);
    const [questions, setQuestions] = React.useState<QuestionResponse[]>(questionInit);
    const [cachedQuestions, setCachedQuestions] = useState<QuestionResponse[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm] = useDebounce(searchTerm, 400);


    useEffect(() => {
        if (data) {
            setQuestions(data.questions.items);
            setCachedQuestions(questions);
        }
    }, [data]);

    useEffect(() => {
        const searchTermRq = debouncedSearchTerm;

        if (debouncedSearchTerm.trim().length === 0) {
            if (cachedQuestions.length !== 0)
                setQuestions(cachedQuestions);
            return;
        }


        async function fetchSearchResult() {
            const result = await getFetcher([`${backendURL}/api/collection/${collectionId}/search/${searchTermRq}`, auth!.accessToken])

            if (IsErrorResponse(result)) {
                notifyError((result as ErrorResponse).title);
                return;
            }

            setQuestions(result as QuestionResponse[]);
        }

        fetchSearchResult().then();
    }, [debouncedSearchTerm])

    const handleRemove = (questionId: string) => {
        setQuestions(questions.filter((q) => q.id !== questionId));
    }

    return (
        <div className="space-y-6">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search questions..."
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg transition-colors"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>

            <div className="space-y-4">
                <AnimatePresence>
                    {questions.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <p className="text-gray-500">No questions found</p>
                        </div>
                    ) : (
                        questions.map((question) => (
                            <CollectionQuestionItem
                                key={question.id}
                                resourceRight={resourceRight}
                                question={question}
                                onRemove={handleRemove}
                                collectionId={collectionId} />
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}