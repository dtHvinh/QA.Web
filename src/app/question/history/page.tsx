'use client'

import {useSearchParams} from "next/navigation";
import useSWR from "swr";
import {getFetcher} from "@/helpers/request-utils";
import getAuth from "@/helpers/auth-utils";
import Loading from "@/app/loading";
import {QuestionHistoryResponse} from "@/types/types";
import {backendURL} from "@/utilities/Constants";
import timeFromNow from "@/helpers/time-utils";

export default function QuestionHistoryPage() {
    const searchParams = useSearchParams();
    const auth = getAuth();

    const {
        data,
        isLoading
    } = useSWR([`${backendURL}/api/question/${searchParams.get('qid')}/history`, auth?.accessToken], getFetcher);

    if (isLoading) {
        return <Loading/>
    }

    const histories = data as QuestionHistoryResponse[];

    return (
        <div>
            <div className={'font-bold text-xl pb-5'}>
                {histories.length} events
            </div>

            <table className="min-w-full bg-white border border-gray-200 text-sm">
                <thead>
                <tr className={'bg-gray-100'}>
                    <th align={'left'} className="py-2 px-4">when</th>
                    <th align={'left'} className="py-2 px-4">type</th>
                    <th align={'left'} className="py-2 px-4">by</th>
                    <th align={'left'} className="py-2 px-4border-b">comment</th>
                </tr>
                </thead>
                <tbody>
                {histories.map((history) => (
                    <tr className={'border-b-[1px]'} key={history.id}>
                        <td className="py-2 px-4">{timeFromNow(history.createdAt)}</td>
                        <td className="py-2 px-4 flex text-white">
                            <div className={'p-1 bg-gray-400'}>
                                {history.questionHistoryType.toLowerCase()}
                            </div>
                        </td>
                        <td className="py-2 px-4">{history.authorName}</td>
                        <td align={'left'} className="py-2 px-4">
                            <div className={'p-0'} dangerouslySetInnerHTML={{__html: history.comment}}></div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}