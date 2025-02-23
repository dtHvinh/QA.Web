import {GetCollectionDetailResponse, QuestionResponse} from "@/types/types";
import React, {useEffect} from "react";
import {backendURL} from "@/utilities/Constants";
import useSWR from "swr";
import getAuth from "@/helpers/auth-utils";
import {getFetcher} from "@/helpers/request-utils";
import Link from "next/link";
import toQuestionDetail from "@/helpers/path";
import UserInfoPopup from "@/components/UserInfoPopup";
import {Delete} from "@mui/icons-material";

export default function CollectionQuestion({collectionId, questionInit, pageIndex, pageSize}: {
    collectionId: string,
    questionInit: QuestionResponse[],
    pageIndex: number,
    pageSize: number,
}) {
    const requestUrl = `${backendURL}/api/collection/${collectionId}/?pageIndex=${pageIndex}&pageSize=${pageSize}`;
    const auth = getAuth();
    const {data} = useSWR<GetCollectionDetailResponse>([requestUrl, auth?.accessToken], getFetcher);
    const [questions, setQuestions] = React.useState<QuestionResponse[]>(questionInit);

    useEffect(() => {
        if (data) {
            setQuestions(data.questions.items);
        }
        console.log(data)
    }, [data]);

    return (
        <div>
            <div className={'flex flex-col gap-5'}>
                {questions.map((question) => (
                    <Link href={toQuestionDetail(question.id, question.slug)} key={question.id}
                          className={'rounded-xl border border-blue-100 p-5 shadow-sm w-full bg-white hover:bg-blue-50 transition'}>
                        <div className={'flex items-center justify-between'}>
                            <div className={'text-lg text-blue-500'}>
                                {question.title}
                            </div>

                            <div className={'flex items-center gap-5'}>
                                <div className={'text-sm text-neutral-500'}>
                                    by&nbsp;
                                    <UserInfoPopup
                                        user={question.author}
                                        className="inline-block hover:text-black transition duration-300 ease-in-out"/>
                                </div>

                                <div>
                                    <Delete fontSize={'small'}/>
                                </div>
                            </div>
                        </div>
                    </Link>))}
            </div>
        </div>
    );
}