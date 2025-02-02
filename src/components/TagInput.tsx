import React, {useEffect, useState} from "react";
import {Autocomplete, Box, TextField, Typography} from "@mui/material";
import {backendURL} from "@/utilities/Constants";
import {getFetcher} from "@/helpers/request-utils";
import {PagedResponse, TagResponse} from "@/types/types";
import getAuth from "@/helpers/auth-utils";
import notifyError from "@/utilities/ToastrExtensions";
import TagLabel from "@/components/TagLabel";
import {useDebounce} from "use-debounce";

export interface TagInputProps {
    onTagChange?: (tagIds: string[]) => void;
    maxTags: number;
}

export default function TagInput({onTagChange, maxTags}: TagInputProps) {
    const auth = getAuth();
    const requestUrl = `${backendURL}/api/tag/search`;

    const [tags, setTags] = useState<TagResponse[]>([]);
    const [selectedTags, setSelectedTags] = useState<TagResponse[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm] = useDebounce(searchTerm, 400);

    useEffect(() => {
        if (debouncedSearchTerm.trim().length === 0) {
            return;
        }

        async function fetchTags() {
            const searchTags = await getFetcher([`${requestUrl}/${debouncedSearchTerm}`, auth!.accessToken]) as PagedResponse<TagResponse>;
            setTags(searchTags.items || []);
        }

        fetchTags().then();

    }, [debouncedSearchTerm]);

    const handleTagChange = (_event: React.SyntheticEvent, newTags: TagResponse[]) => {
        if (newTags.length > maxTags) {
            notifyError(`You can only select up to ${maxTags} tags`);
            return;
        }

        setSelectedTags(newTags);

        if (onTagChange) {
            onTagChange(newTags.map((tag) => tag.id));
        }
    };

    return (
        <div>
            <Autocomplete
                multiple
                options={tags}
                getOptionLabel={(option) => option.name}
                value={selectedTags}
                onChange={handleTagChange}
                renderTags={(value: TagResponse[], getTagProps) =>
                    value.map((option: TagResponse, index: number) => (
                        <TagLabel
                            {...getTagProps({index})}
                            {...option}
                            name={option.name}
                            key={option.id}
                            className={"mr-2"}
                            onClick={(name: string) => {
                                setSelectedTags(selectedTags.filter((tag) => tag.name !== name));
                            }}
                        />
                    ))
                }
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="outlined"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder={"Select up to 5 tags"}
                    />
                )}
                renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                        <div>
                            <Typography variant="subtitle1" fontWeight="bold">
                                {option.name}
                            </Typography>
                            <Typography variant={'caption'} className={'text-gray-600 line-clamp-5'}>
                                {option.description}
                            </Typography>
                        </div>
                    </li>
                )}
                slotProps={{
                    listbox: {
                        component: (props) => (
                            <Box
                                component="ul"
                                {...props}
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                                    gap: 1,
                                    padding: 2,
                                }}
                            >
                                {props.children}
                            </Box>
                        ),
                    },
                }}
            />
        </div>
    );
}