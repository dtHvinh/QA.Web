import { getFetcher } from '@/helpers/request-utils';
import { TagResponse } from '@/types/types';
import { Popover } from '@mui/material';
import React, { FormEvent, useState } from 'react';
import { useDebounce } from 'use-debounce';

interface SearchInputProps {
    onSearch: (searchTerm: string, selectedTag?: TagResponse) => void;
}

export default function SearchInput({ onSearch }: SearchInputProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [tagSelectText, setTagSelectText] = useState("All");
    const [selectedTag, setSelectedTag] = useState<TagResponse>();
    const [tagSearchTerm, setTagSearchTerm] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm] = useDebounce(tagSearchTerm, 700);
    const [tags, setTags] = useState<TagResponse[]>([]);
    const tagSearchInputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (debouncedSearchTerm.trim().length === 0) return;

        const fetchSearchTags = async () => {
            const searchTags = await getFetcher(`/api/tag/search/${debouncedSearchTerm}`);
            setTags(searchTags.items || []);
        };

        fetchSearchTags();
    }, [debouncedSearchTerm]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSearch(searchTerm, selectedTag);
    };

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleTagButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        setIsDropdownOpen(true);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setIsDropdownOpen(false);
    };

    return (
        <div className="relative max-w-2xl w-full">
            <form onSubmit={handleSubmit}>
                <div className="relative">
                    <input
                        type="text"
                        className="w-full h-10 pl-10 pr-32 rounded-full border border-[var(--border-color)] bg-[var(--input-background)] focus:bg-[var(--card-background)] transition-all text-sm text-[var(--text-primary)]"
                        placeholder="Search questions..."
                        autoComplete="off"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <svg className="w-4 h-4 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <div className="absolute right-1 top-1/2 -translate-y-1/2">
                        <button
                            type="button"
                            onClick={(e) => {
                                handleTagButtonClick(e);
                                setTimeout(() => {
                                    tagSearchInputRef.current?.focus();
                                }, 100);
                            }}
                            className="px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                        >
                            {tagSelectText}
                        </button>
                    </div>
                </div>
            </form>

            <Popover
                open={isDropdownOpen}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                slotProps={{
                    paper: {
                        className: "w-[672px] rounded-xl shadow-lg mt-2 bg-[var(--card-background)] border border-[var(--border-color)]",
                    }
                }}
            >
                <div className="p-3 border-b border-[var(--border-color)] bg-[var(--card-background)]">
                    <input
                        ref={tagSearchInputRef}
                        placeholder="Search tags..."
                        className="w-full px-3 py-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--input-background)] text-[var(--text-primary)] transition-all text-sm"
                        onChange={(e) => setTagSearchTerm(e.target.value)}
                    />
                </div>

                <div className="overflow-y-auto p-2 bg-[var(--card-background)]">
                    <div className="space-y-1">
                        {tags?.map((tag) => (
                            <button
                                key={tag.id}
                                type="button"
                                className="w-full p-2 text-left rounded-lg hover:bg-[var(--hover-background)] transition-colors"
                                onClick={() => {
                                    setSelectedTag(tag);
                                    handleClose();
                                    setTagSelectText(tag.name);
                                }}
                            >
                                <div className="font-medium text-[var(--text-primary)]">{tag.name}</div>
                                <div className="text-xs text-[var(--text-secondary)] line-clamp-3">{tag.description}</div>
                            </button>
                        ))}
                    </div>
                </div>
            </Popover>
        </div>
    );
}