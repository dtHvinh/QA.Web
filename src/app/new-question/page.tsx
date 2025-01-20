'use client'

import TextEditor from "@/components/TextEditor";
import TagInput from "@/components/TagInput";
import React, {useState} from "react";

export default function NewQuestion() {
    const [tagIds, setTagIds] = useState<string[]>([]);
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');

    const handleTagChange = (tagIds: string[]) => {
        setTagIds(tagIds);
    };

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        const formData = new FormData(event.currentTarget);
        const name = formData.get('title') as string;

        console.log({name, content, tagIds});
    }

    return (
        <div className="md:mx-auto md:w-3/4 p-4">
            <div className="text-2xl">Ask a question</div>

            <form className="mt-4 space-y-4" method="POST" onSubmit={handleFormSubmit}>
                <div className="space-y-2">
                    <label htmlFor="title" className="block text-xl font-medium text-gray-700">Title</label>
                    <input
                        type="text"
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
                        <TagInput onTagChange={handleTagChange}/>
                    </div>
                </div>

                <div className={'flex justify-end'}>
                    <div className={'flex space-x-2.5'}>
                        <button className={'border-[2px] border-gray-400 p-2 rounded-lg'}>
                            Save as Draft
                        </button>
                        <button className={'p-2 rounded-lg bg-[#5783db] hover:bg-[#5783db] text-white'}>
                            Send
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}