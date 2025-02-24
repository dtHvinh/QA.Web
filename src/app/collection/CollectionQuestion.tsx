import { GetCollectionDetailResponse, QuestionResponse } from "@/types/types";
import React, { useEffect, useState } from "react";
import { backendURL } from "@/utilities/Constants";
import useSWR from "swr";
import getAuth from "@/helpers/auth-utils";
import { getFetcher, IsErrorResponse } from "@/helpers/request-utils";
import Link from "next/link";
import toQuestionDetail from "@/helpers/path";
import UserInfoPopup from "@/components/UserInfoPopup";
import { Delete } from "@mui/icons-material";
import { useDebounce } from "use-debounce";
import notifyError from "@/utilities/ToastrExtensions";
import { ErrorResponse } from "@/props/ErrorResponse";

export default function CollectionQuestion({ collectionId, questionInit, pageIndex, pageSize }: {
    collectionId: string,
    questionInit: QuestionResponse[],
    pageIndex: number,
    pageSize: number,
}) {
    const requestUrl = `${backendURL}/api/collection/${collectionId}/?pageIndex=${pageIndex}&pageSize=${pageSize}`;
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

    return (
        <div>
            <div className="mb-5">
                <input
                    type="text"
                    placeholder="Search questions..."
                    className="w-full p-2 px-4 border border-gray-300  rounded-full"
                    onChange={(e) => {
                        const searchTerm = e.target.value;
                        setSearchTerm(searchTerm);
                    }}
                />
            </div>

            <div className={'flex flex-col gap-5'}>
                {questions.map((question) => (
                    <Link href={toQuestionDetail(question.id, question.slug)} key={question.id}
                        className={'rounded-2xl p-5 shadow-md w-full bg-white hover:bg-blue-50 transition'}>
                        <div className={'flex items-center justify-between'}>
                            <div className={'text-lg text-blue-700'}>
                                {question.title}
                            </div>

                            <div className={'flex items-center gap-5'}>
                                <div className={'text-sm text-neutral-500'}>
                                    by&nbsp;
                                    <UserInfoPopup
                                        user={question.author}
                                        className="inline-block hover:text-black transition duration-300 ease-in-out" />
                                </div>

                                <div>
                                    <Delete fontSize={'small'} />
                                </div>
                            </div>
                        </div>
                    </Link>))}
            </div>
        </div>
    );
}