'use client'

import Loading from "@/app/loading";
import ItemPerPage from "@/components/ItemPerPage";
import YourQuestionItem from "@/components/YourQuestionItem";
import getAuth from "@/helpers/auth-utils";
import { getFetcher } from "@/helpers/request-utils";
import { PagedResponse, QuestionResponse } from "@/types/types";
import { Pagination } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const queryTerm = searchParams.get('q');
    const queryTagId = searchParams.get('tag');

    const [searchResults, setSearchResults] = useState<QuestionResponse[]>([]);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [isFetching, setIsFetching] = useState(false);
    const auth = getAuth();

    const fetchResults = async () => {
        setIsFetching(true);
        const response = await getFetcher([
            `/api/question/search?tagId=${queryTagId}&searchTerm=${queryTerm}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
            auth!.accessToken
        ]) as PagedResponse<QuestionResponse>;

        setIsFetching(false);
        setTotalPages(response.totalPage);
        setTotalCount(response.totalCount);
        setSearchResults(response.items || []);
    };

    useEffect(() => {
        fetchResults();
    }, [queryTerm, queryTagId, pageIndex, pageSize]);

    return (
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
            {queryTerm && queryTagId && (
                <div className="space-y-6">
                    {isFetching ? (
                        <div className="flex justify-center py-12">
                            <Loading />
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between">
                                <h1 className="text-xl font-semibold text-gray-900">
                                    Search Results
                                </h1>
                                {searchResults.length > 0 && (
                                    <p className="text-sm text-gray-500">
                                        Showing {Math.min(pageSize, searchResults.length)} of {totalCount} results
                                    </p>
                                )}
                            </div>

                            {searchResults.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-gray-400 text-lg">
                                        No results found for your search
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2">
                                        Try adjusting your search or filter to find what you're looking for
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        {searchResults.map((question) => (
                                            <YourQuestionItem
                                                question={question}
                                                key={question.id}
                                            />
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t">
                                        <ItemPerPage
                                            onPageSizeChange={setPageSize}
                                            values={[10, 20, 30]}
                                        />
                                        <Pagination
                                            page={pageIndex}
                                            count={totalPages}
                                            onChange={(_, page) => setPageIndex(page)}
                                            color="primary"
                                            shape="rounded"
                                        />
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}