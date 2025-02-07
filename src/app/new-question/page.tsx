'use client'

import TextEditor from "@/components/TextEditor";
import TagInput from "@/components/TagInput";
import React, {useState} from "react";
import {Apis, backendURL} from "@/utilities/Constants";
import {fetcher, IsErrorResponse} from "@/helpers/request-utils";
import notifyError, {notifySucceed} from "@/utilities/ToastrExtensions";
import {CreateQuestionResponse} from "@/types/types";
import {ErrorResponse} from "@/props/ErrorResponse";
import getAuth from "@/helpers/auth-utils";
import {useRouter} from "next/navigation";
import {toQuestionPage} from "@/helpers/route-utils";
import {Checkbox, FormControlLabel} from "@mui/material";

export default function NewQuestion() {
    const [tagIds, setTagIds] = useState<string[]>([]);
    const [content, setContent] = useState<string>('');
    const auth = getAuth();
    const router = useRouter();
    const [isDraft, setIsDraft] = useState<boolean>(false);

    const requestUrl = `${backendURL}${Apis.Question.Create}`;

    const handleTagChange = (tagIds: string[]) => {
        setTagIds(tagIds);
    };

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const title = formData.get('title') as string;

        if (content.replaceAll(' ', '').length <= 7) {
            notifyError('Must not leave question detail empty');
            return;
        }

        const response = await fetcher<CreateQuestionResponse>(
            [
                'POST',
                isDraft ? `${requestUrl}?isDraft=true` : requestUrl,
                auth!.accessToken,
                JSON.stringify({
                    title: title,
                    content: content.trim(),
                    tags: tagIds
                })
            ]);

        if (IsErrorResponse(response)) {
            notifyError((response as ErrorResponse).errors);
        } else {
            notifySucceed('Question submitted successfully');

            const res = (response as CreateQuestionResponse);

            router.push(toQuestionPage(res.id, res.slug));
        }
    }

    return (
        <div className="md:mx-auto md:w-3/4 p-4">
            <div className="text-2xl">Ask a question</div>
            <form className="mt-4 space-y-4" method="POST" onSubmit={handleFormSubmit}>
                <div className="space-y-2">
                    <label htmlFor="title" className="block text-xl font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        spellCheck={false}
                        name="title"
                        placeholder="e.g. How to use React Query?"
                        required
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-blue-600"/>
                </div>

                <div className="space-y-2 w-full">
                    <label htmlFor="details" className="block text-xl font-medium text-gray-700">Details</label>
                    <TextEditor currentText={''} onTextChange={setContent}/>
                </div>


                <div>
                    <div className="space-y-2">
                        <div className={'flex items-baseline space-x-2.5'}>
                            <label htmlFor="tag" className="block text-xl font-medium text-gray-700">Tags</label>
                            <small className={'text-gray-400'}>
                                Add up to 5 tags to describe what your question is about. Start typing to see
                                suggestions.
                            </small>
                        </div>
                        <TagInput onTagIdChange={handleTagChange} maxTags={5}/>
                    </div>
                </div>

                <div className={'flex justify-end'}>
                    <div className={'flex space-x-2.5'}>
                        <FormControlLabel value={isDraft} onChange={() => setIsDraft(!isDraft)} control={<Checkbox/>}
                                          label="Is Draft"/>
                        <button
                            className={'p-2 rounded-lg bg-[#5783db] hover:bg-[#5783db] transition-all text-white active:scale-95'}>
                            {isDraft ? 'Save as draft' : 'Create question'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}