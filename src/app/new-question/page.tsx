'use client'

import TextEditor from "@/components/Editors/TextEditor";
import TagInput from "@/components/TagInput";
import { IsErrorResponse, postFetcher } from "@/helpers/request-utils";
import { Apis } from "@/utilities/Constants";
import notifyError, { notifySucceed } from "@/utilities/ToastrExtensions";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function NewQuestion() {
    const [tagIds, setTagIds] = useState<string[]>([]);
    const [content, setContent] = useState<string>('');
    const router = useRouter();
    const [isSendDisabled, setIsSendDisabled] = useState<boolean>(false);

    const handleTagChange = (tagIds: string[]) => {
        setTagIds(tagIds);
    };

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        setIsSendDisabled(true);

        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const title = formData.get('title') as string;

        if (content.replaceAll(' ', '').length <= 7) {
            notifyError('Must not leave question detail empty');
            return;
        }

        const response = await postFetcher(
            `${Apis.Question.Create}`,
            JSON.stringify({
                title: title,
                content: content.trim(),
                tags: tagIds
            }));

        if (IsErrorResponse(response)) {
            setIsSendDisabled(false);
        } else {
            notifySucceed('Question submitted successfully');
            router.push('/');
        }
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)]">Ask a Question</h1>
                    <p className="mt-2 text-[var(--text-secondary)]">Get help from the community by asking a clear, well-structured question</p>
                </div>

                <form className="space-y-6" method="POST" onSubmit={handleFormSubmit}>
                    <div className="space-y-2">
                        <label htmlFor="title" className="block text-sm font-medium text-[var(--text-primary)]">
                            Question Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            spellCheck={false}
                            placeholder="e.g. How to use React Query?"
                            required
                            className="w-full px-4 py-3 border border-[var(--border-color)] bg-[var(--input-background)] text-[var(--text-primary)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                        <p className="text-sm text-[var(--text-secondary)]">
                            Be specific and imagine you're asking a question to another person
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="details" className="block text-sm font-medium text-[var(--text-primary)]">
                            Question Details
                        </label>
                        <div className="border border-[var(--border-color)] rounded-lg">
                            <TextEditor currentText={''} onTextChange={setContent} />
                        </div>
                        <p className="text-sm text-[var(--text-secondary)]">
                            Include all the information someone would need to answer your question
                        </p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label htmlFor="tag" className="block text-sm font-medium text-[var(--text-primary)]">
                                Tags
                            </label>
                            <span className="text-sm text-[var(--text-secondary)]">
                                Max 5 tags
                            </span>
                        </div>
                        <TagInput onTagIdChange={handleTagChange} maxTags={5} />
                        <p className="text-sm text-[var(--text-secondary)]">
                            Add up to 5 tags to describe what your question is about. Start typing to see suggestions.
                        </p>
                    </div>

                    <div className="flex items-center justify-end space-x-4 pt-6 border-t border-[var(--border-color)]">
                        <button
                            type="submit"
                            disabled={isSendDisabled}
                            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-[var(--disabled-background)] disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Post Question
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}