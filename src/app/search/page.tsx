'use client'

import React, {FormEvent, useEffect, useState} from "react";
import {PagedResponse, QuestionResponse, TagResponse} from "@/types/types";
import {useDebounce} from "use-debounce";
import getAuth from "@/helpers/auth-utils";
import {backendURL} from "@/utilities/Constants";
import {getFetcher} from "@/helpers/request-utils";
import notifyError from "@/utilities/ToastrExtensions";
import YourQuestionItem from "@/components/YourQuestionItem";
import Loading from "@/app/loading";
import ItemPerPage from "@/components/ItemPerPage";
import {Pagination} from "@mui/material";

export default function SearchPage() {
    const [searchResults, setSearchResults] = useState<QuestionResponse[]>([]);
    const [questionSearchTerm, setQuestionSearchTerm] = useState('');
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [isFetching, setIsFetching] = useState(false);

    const auth = getAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [tagSelectText, setTagSelectText] = useState("Select a tag");
    const [selectedTag, setSelectedTag] = useState<TagResponse>();
    const [tagSearchTerm, setTagSearchTerm] = useState("");
    const [debouncedSearchTerm] = useDebounce(tagSearchTerm, 700);
    const [tags, setTags] = useState<TagResponse[]>([]);
    const questionRequestUrl = `${backendURL}/api/question/search?tagId=${selectedTag?.id}&searchTerm=
                ${questionSearchTerm.trim()}&pageIndex=${pageIndex}&pageSize=${pageSize}`;

    const tagRequestUrl = `${backendURL}/api/tag/search`;

    useEffect(() => {
        if (debouncedSearchTerm.trim().length === 0) {
            return;
        }

        async function fetchSearchTags() {
            const searchTags = await getFetcher([`${tagRequestUrl}/${debouncedSearchTerm}`, auth!.accessToken]) as PagedResponse<TagResponse>;
            setTags(searchTags.items || []);
        }

        fetchSearchTags().then();

    }, [debouncedSearchTerm]);

    useEffect(() => {
        if (selectedTag)
            fetchQuestion().then();
    }, [pageIndex, pageSize]);

    const handleTagSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTagSearchTerm(e.target.value);
    }

    const handleQuestionSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuestionSearchTerm(e.target.value);
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await fetchQuestion();
    }

    const fetchQuestion = async () => {
        if (!selectedTag) {
            notifyError('Please select a tag');
            return;
        }
        setIsFetching(true);

        const response = await getFetcher([
            questionRequestUrl,
            auth!.accessToken
        ]) as PagedResponse<QuestionResponse>;

        setIsFetching(false);

        setTotalPages(response.totalPage);
        setTotalCount(response.totalCount);

        setSearchResults(response.items || []);
    }

    return (
        <div className={'grid grid-cols-2 gap-2'}>
            <div
                className="flex relative h-12 col-span-full">
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="shrink-0 rounded-full z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 hover:bg-gray-200 focus:ring-0 focus:outline-none"
                    type="button"
                >
                    {tagSelectText}{" "}
                    <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                         fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="m1 1 4 4 4-4"/>
                    </svg>
                </button>
                <div
                    id="dropdown"
                    className={`${isDropdownOpen ? '' : 'hidden'} shadow-2xl border-[2px] rounded-lg mt-2 z-10 divide-y absolute min-h-52 overflow-y-auto bg-white`}
                    style={{top: "100%", left: 0}}
                >
                    <div className={'w-full'}>
                        <input placeholder={'Search a name...'}
                               className={'w-full p-1 px-5 border-b-2 outline-0'}
                               onChange={handleTagSearchInputChange}/>
                    </div>

                    <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 p-2 text-sm text-gray-700"
                        aria-labelledby="dropdown-button">
                        {tags?.map((tag) => (
                            <li key={tag.id}>
                                <button
                                    type="button"
                                    className="w-full px-4 py-5 h-full text-left flex flex-col gap-1 hover:bg-gray-100"
                                    onClick={() => {
                                        setSelectedTag(tag);
                                        setIsDropdownOpen(false);
                                        setTagSelectText(tag.name);
                                    }}
                                >
                                    <div className="font-medium text-gray-900">{tag.name}</div>
                                    <div
                                        className="text-sm text-gray-400 line-clamp-4">{tag.description}</div>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="ml-5 relative h-full w-full">
                    <form className={'h-full'} onSubmit={handleSubmit}>
                        <input
                            type="text"
                            id="search-dropdown"
                            className="border-gray-400 px-5 w-full rounded-full focus-visible:outline-0 p-2.5  h-full z-20 text-sm text-gray-900 bg-gray-50 border"
                            placeholder="How to center a div..."
                            autoComplete={'off'}
                            onChange={handleQuestionSearchInputChange}
                            autoFocus={true}
                        />
                        <button
                            type="submit"
                            className="absolute p-4 top-0 end-0 text-sm font-medium h-full rounded-e-lg"
                        >
                            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                 viewBox="0 0 20 20">
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                />
                            </svg>
                            <span className="sr-only">Search</span>
                        </button>
                    </form>
                </div>
            </div>

            <div className={'col-span-full mt-5 space-y-3'}>
                {isFetching && <Loading/>}

                {searchResults.length !== 0 && (
                    <div className={'text-gray-500'}>
                        {`Showing ${pageSize} of ${totalCount} results`}
                    </div>
                )}

                {searchResults.map((question) => (
                    <YourQuestionItem question={question} key={question.id}/>
                ))}

                {searchResults.length !== 0 && (
                    <div className={'flex justify-between'}>
                        <ItemPerPage onPageSizeChange={setPageSize} values={[10, 20, 30]}/>

                        <Pagination page={pageIndex} count={totalPages} onChange={(e, page) => setPageIndex(page)}/>
                    </div>
                )}
            </div>
        </div>
    );
}