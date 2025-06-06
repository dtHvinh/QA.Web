'use client'

import TextEditor from "@/components/Editors/TextEditor";
import ModeratorPrivilege from "@/components/Privilege/ModeratorPrivilege";
import { getFetcher, IsErrorResponse, putFetcher } from "@/helpers/request-utils";
import { TagDetailResponse } from "@/types/types";
import { notifySucceed } from "@/utilities/ToastrExtensions";
import { use, useEffect, useState } from "react";
import useSWR from "swr";

export default function EditTagPage({ params }: { params: Promise<{ id: number }> }) {
    const { id } = use(params);
    const { data: tag, isLoading } = useSWR<TagDetailResponse>(`/api/tag/wiki/${id}`, getFetcher)

    const [name, setName] = useState('')
    const [wikiBody, setWikiBody] = useState('')
    const [description, setDescription] = useState('')

    useEffect(() => {
        if (!IsErrorResponse(tag)) {
            setName(tag?.name ?? '')
            setDescription(tag?.description ?? '')
            setWikiBody(tag?.wikiBody ?? '')
        }
    }, [tag])


    const handleTagUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const response = await putFetcher(`/api/tag`, JSON.stringify({
            id,
            name,
            description,
            wikiBody
        }))

        if (!IsErrorResponse(response)) {
            notifySucceed('Tag updated successfully')
            window.location.href = `/tags/${id}/${tag?.name}`
        }
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            {isLoading ? (
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-[var(--skeleton-color)] rounded w-1/4"></div>
                    <div className="h-32 bg-[var(--skeleton-color)] rounded"></div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Edit Tag: {tag?.name}</h1>
                        <p className="mt-1 text-sm text-[var(--text-secondary)]">Update tag information and description</p>
                    </div>

                    <form onSubmit={handleTagUpdate} className="space-y-6">
                        <ModeratorPrivilege>
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-primary)]">Tag Name</label>
                                <input
                                    type="text"
                                    spellCheck={false}
                                    defaultValue={tag?.name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-[var(--border-color)] bg-[var(--input-background)] text-[var(--text-primary)] px-3 py-2 
                                         shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        </ModeratorPrivilege>

                        <div>
                            <label className="block text-sm font-medium text-[var(--text-primary)]">Description</label>
                            <textarea
                                rows={6}
                                spellCheck={false}
                                defaultValue={tag?.description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-[var(--border-color)] bg-[var(--input-background)] text-[var(--text-primary)] px-3 py-2 
                                         shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <p className="mt-2 text-sm text-[var(--text-secondary)]">
                                Brief description of what this tag represents
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--text-primary)]">Wiki Content</label>
                            <TextEditor currentText={tag?.wikiBody ?? ""} onTextChange={setWikiBody} />
                            <p className="mt-2 text-sm text-[var(--text-secondary)]">
                                Detailed information about the tag (supports markdown)
                            </p>
                        </div>

                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                className="px-4 py-2 border border-[var(--border-color)] rounded-md text-sm font-medium 
                                         text-[var(--text-primary)] bg-[var(--card-background)] hover:bg-[var(--hover-background)] focus:outline-none focus:ring-2 
                                         focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm 
                                         font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none 
                                         focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}