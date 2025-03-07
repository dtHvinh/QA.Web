'use client'

import Loading from "@/app/loading";
import getAuth from "@/helpers/auth-utils";
import { getFetcher } from "@/helpers/request-utils";
import timeFromNow from "@/helpers/time-utils";
import { QuestionHistoryResponse } from "@/types/types";
import { backendURL } from "@/utilities/Constants";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";

export default function QuestionHistoryPage() {
    const searchParams = useSearchParams();
    const auth = getAuth();

    const {
        data,
        isLoading
    } = useSWR([`${backendURL}/api/question/${searchParams.get('qid')}/history`, auth?.accessToken], getFetcher);

    if (isLoading) {
        return <Loading />
    }

    const histories = data as QuestionHistoryResponse[];

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-xl font-bold text-gray-900">Question History</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        {histories.length} revision{histories.length !== 1 ? 's' : ''}
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 text-left text-sm text-gray-600">
                                <th className="py-3 px-6 font-medium">When</th>
                                <th className="py-3 px-6 font-medium">Type</th>
                                <th className="py-3 px-6 font-medium">Author</th>
                                <th className="py-3 px-6 font-medium">Comment</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {histories.map((history) => (
                                <tr key={history.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-6 text-sm text-gray-600">
                                        {timeFromNow(history.createdAt)}
                                    </td>
                                    <td className="py-3 px-6">
                                        <span className={`
                                            inline-flex px-2.5 py-1 text-xs font-medium rounded-full
                                            ${history.questionHistoryType.toLowerCase() === 'edited'
                                                ? 'bg-blue-100 text-blue-700'
                                                : history.questionHistoryType.toLowerCase() === 'created'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-700'
                                            }
                                        `}>
                                            {history.questionHistoryType.toLowerCase()}
                                        </span>
                                    </td>
                                    <td className="py-3 px-6 text-sm">
                                        <span className="font-medium text-gray-900">
                                            {history.authorName}
                                        </span>
                                    </td>
                                    <td className="py-3 px-6 text-sm text-gray-600">
                                        <div
                                            className="prose prose-sm max-w-none"
                                            dangerouslySetInnerHTML={{ __html: history.comment }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {histories.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No history records found</p>
                    </div>
                )}
            </div>
        </div>
    );
}