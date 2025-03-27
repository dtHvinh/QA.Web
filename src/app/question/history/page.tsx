'use client'

import Loading from "@/app/loading";
import HistoryRowItem from "@/components/History/HistoryRowItem";
import { getFetcher } from "@/helpers/request-utils";
import { QuestionHistoryResponse } from "@/types/types";
import { backendURL } from "@/utilities/Constants";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";

export default function QuestionHistoryPage() {
    const searchParams = useSearchParams();

    const {
        data,
        isLoading
    } = useSWR(`${backendURL}/api/question/${searchParams.get('qid')}/history`, getFetcher);

    if (isLoading) {
        return <Loading />
    }

    const histories = data as QuestionHistoryResponse[];

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            <div className="bg-[var(--card-background)] rounded-xl shadow-sm border border-[var(--border-color)] overflow-hidden">
                <div className="p-6 border-b border-[var(--border-color)]">
                    <h1 className="text-xl font-bold text-[var(--text-primary)]">Question History</h1>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">
                        {histories.length} revision{histories.length !== 1 ? 's' : ''}
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[var(--hover-background)] text-left text-sm text-[var(--text-secondary)]">
                                <th className="py-3 px-6 font-medium">When</th>
                                <th className="py-3 px-9 font-medium">Type</th>
                                <th className="py-3 px-6 font-medium">Author</th>
                                <th className="py-3 px-6 font-medium">Comment</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)]">
                            {histories.map((history) => (
                                <HistoryRowItem
                                    key={history.id}
                                    history={history} />
                            ))}
                        </tbody>
                    </table>
                </div>

                {histories.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-[var(--text-tertiary)]">No history records found</p>
                    </div>
                )}
            </div>
        </div>
    );
}