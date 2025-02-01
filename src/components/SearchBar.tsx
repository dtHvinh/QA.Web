import React, {useEffect, useState} from "react";
import {backendURL} from "@/utilities/Constants";
import {getFetcher} from "@/helpers/request-utils";
import getAuth from "@/helpers/auth-utils";
import {PagedResponse, TagResponse} from "@/types/types";
import {useDebounce} from "use-debounce";

export default function SearchBar(params: { open: boolean; onClose: () => void }) {
    const {open, onClose} = params;
    const [isSearchOpen, setIsSearchOpen] = useState(open);
    const [tagSelectText, setTagSelectText] = useState("Select tag");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedTag, setSelectedTag] = useState<TagResponse>();
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm] = useDebounce(searchTerm, 700);
    const [tags, setTags] = useState<TagResponse[]>([]);

    const auth = getAuth();

    const requestUrl = `${backendURL}/api/tag/search`;

    useEffect(() => {
        if (debouncedSearchTerm.trim().length === 0) {
            return;
        }

        async function fetchSearchTags() {
            const searchTags = await getFetcher([`${requestUrl}/${debouncedSearchTerm}`, auth!.accessToken]) as PagedResponse<TagResponse>;
            setTags(searchTags.items || []);
        }

        fetchSearchTags().then();

    }, [debouncedSearchTerm]);

    useEffect(() => {
        setIsSearchOpen(open);
    }, [open]);

    const handleClickOutside = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).id === "overlay") {
            setIsSearchOpen(false);
            onClose();
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    }

    return (
        <div
            id="overlay"
            onClick={handleClickOutside}
            className={`${
                isSearchOpen ? "fixed inset-0 bg-black bg-opacity-50" : "hidden"
            } w-full h-full flex items-center justify-center z-50`}
        >
            <form
                className="w-full md:w-1/2 mx-auto -mt-36"
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    className="flex relative h-12">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-0 focus:outline-none"
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
                        className={`${isDropdownOpen ? '' : 'hidden'} mt-2 z-10 bg-white divide-y divide-gray-100 rounded-lg absolute shadow-sm h-96 overflow-y-scroll`}
                        style={{top: "100%", left: 0}}
                    >
                        <input placeholder={'Search a name'}
                               className={'bg-transparent w-full p-1 px-5 border-b-2 outline-0'}
                               onChange={handleSearchChange}/>

                        <ul className="grid grid-cols-3 gap-2 p-2  text-sm text-gray-700"
                            aria-labelledby="dropdown-button">
                            {tags?.map((tag) => (
                                <li key={tag.id}>
                                    <button
                                        type="button"
                                        className="w-full px-4 py-2 text-left hover:bg-gray-100"
                                        onClick={() => {
                                            setSelectedTag(tag);
                                            setIsDropdownOpen(false);
                                            setTagSelectText(tag.name);
                                        }}
                                    >
                                        <div className="font-medium text-gray-900">{tag.name}</div>
                                        <div
                                            className="text-sm text-gray-500 line-clamp-5">{tag.description}</div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="relative h-full w-full">
                        <input
                            type="search"
                            id="search-dropdown"
                            className="block p-2.5 w-full h-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="How to center a div..."
                            required
                            autoComplete={'off'}
                        />
                        <button
                            type="submit"
                            className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
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
                    </div>
                </div>
            </form>
        </div>
    );
}