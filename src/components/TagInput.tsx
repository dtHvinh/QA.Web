// src/components/TagInput.tsx
import React, {useEffect, useState} from 'react';
import {Autocomplete, TextField} from '@mui/material';
import TagLabel from './TagLabel';
import {backendURL} from "@/utilities/Constants";
import useSWR from "swr";
import notifyError from "@/utilities/ToastrExtensions";
import {getFetcher} from "@/helpers/request-utils";
import {TagObject} from "@/types/types";
import getAuth from "@/helpers/auth-utils";


export interface TagInputProps {
    onTagChange?: (tagIds: string[]) => void
    maxTags: number
}

export default function TagInput({onTagChange, maxTags}: TagInputProps) {
    const [tags, setTags] = useState<TagObject[]>([]);
    const [selectedTags, setSelectedTags] = useState<TagObject[]>([]);
    const auth = getAuth();

    const requestUrl = `${backendURL}/api/tag/all`;

    const {data, error, isLoading} = useSWR([requestUrl, auth?.accessToken], getFetcher);

    useEffect(() => {
        if (data) {
            setTags(data);
        }
        if (error) {
            notifyError('Failed to fetch tags');
        }
    }, [data, error]);

    const handleTagChange = (_event: React.SyntheticEvent, newTags: TagObject[]) => {
        if (newTags.length > maxTags) {
            notifyError(`You can only select up to ${maxTags} tags`);
            return;
        }

        setSelectedTags(newTags);

        if (onTagChange) {
            onTagChange(newTags.map(tag => tag.id));
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
                renderTags={(value: TagObject[], getTagProps) =>
                    value.map((option: TagObject, index: number) => (
                        <TagLabel {...getTagProps({index})}
                                  {...option}
                                  name={option.name}
                                  key={option.id}
                                  className={'mr-2'}
                                  onClick={(name: string) => {
                                      setSelectedTags(selectedTags.filter(tag => tag.name !== name))
                                  }}/>
                    ))
                }
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="outlined"
                        placeholder={isLoading ? 'Loading tags...' : 'Select up to 5 tags'}
                    />
                )}
            />
        </div>
    );
}