'use client'

import TextEditor2 from "@/components/Editors/TextEditor2";
import { IsErrorResponse, postFetcher } from "@/helpers/request-utils";
import notifyError, { notifySucceed } from "@/utilities/ToastrExtensions";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function CreateTagPage() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [wikiBody, setWikiBody] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            notifyError('Tag name is required');
            return;
        }

        setIsSubmitting(true);

        const response = await postFetcher('/api/tag', JSON.stringify({ name, description, wikiBody }));

        if (!IsErrorResponse(response)) {
            notifySucceed('Tag created successfully');
            router.push('/tags');
        }
        else
            setIsSubmitting(false);
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-[var(--border-color)]">
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">Create New Tag</h1>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">Add a new tag to help categorize questions</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-medium text-[var(--text-primary)]">
                            Tag Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            spellCheck={false}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--input-background)] text-[var(--text-primary)]"
                            placeholder="Enter tag name"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="description" className="block text-sm font-medium text-[var(--text-primary)]">
                            Short Description <small className="text-[var(--text-secondary)]">(optional)</small>
                        </label>
                        <input
                            type="text"
                            id="description"
                            spellCheck={false}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--input-background)] text-[var(--text-primary)]"
                            placeholder="Brief description of the tag"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-[var(--text-primary)]">
                            Wiki Content <small className="text-[var(--text-secondary)]">(optional)</small>
                        </label>
                        <div className="border border-[var(--border-color)] rounded-lg">
                            <TextEditor2 currentText="" onTextChange={(e) => setWikiBody(e)} />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting || !name.trim()}
                            className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-[var(--disabled-background)] disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}