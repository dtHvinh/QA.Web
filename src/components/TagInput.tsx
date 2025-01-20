import React, {useState} from 'react';
import {Autocomplete, TextField} from '@mui/material';
import TagLabel from './TagLabel';

const programmingTags: TagObject[] = [
    {id: "1", name: "javascript"},
    {id: "2", name: "typescript"},
    {id: "3", name: "react"},
    {id: "4", name: "nodejs"},
    {id: "5", name: "express"},
    {id: "6", name: "graphql"},
    {id: "7", name: "html"},
    {id: "8", name: "css"},
    {id: "9", name: "redux"},
    {id: "10", name: "nextJs"}
];

export interface TagObject {
    id: string,
    name: string
}

export interface TagInputProps {
    onTagChange?: (tagIds: string[]) => void
}

export default function TagInput(params: TagInputProps) {
    const [tags, setTags] = useState<TagObject[]>([]);
    const {onTagChange} = params;

    const handleTagChange =
        (_event: React.SyntheticEvent, newTags: TagObject[]) => {
            setTags(newTags);

            if (onTagChange) {
                onTagChange(newTags.map(tag => tag.id));
            }
        };

    return (
        <div>
            <Autocomplete
                multiple
                options={programmingTags}
                getOptionLabel={(option) => option.name}
                value={tags}
                onChange={handleTagChange}
                renderTags={(value: TagObject[], getTagProps) =>
                    value.map((option: TagObject, index: number) => (
                        <TagLabel text={option.name}
                                  {...getTagProps({index})}
                                  key={option.id}
                                  className={'mr-2'}/>
                    ))
                }
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="outlined"
                    />
                )}
            />
        </div>
    );
}