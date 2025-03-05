import TagInput from "@/components/TagInput";
import TextEditor from "@/components/TextEditor";
import getAuth from "@/helpers/auth-utils";
import { IsErrorResponse, putFetcher } from "@/helpers/request-utils";
import { formatString } from "@/helpers/string-utils";
import { QuestionResponse, TagResponse } from "@/types/types";
import { Apis, backendURL } from "@/utilities/Constants";
import { notifySucceed } from "@/utilities/ToastrExtensions";
import { useEffect, useState } from "react";

export default function EditSection({ question, onEditSuccess }: {
    question: QuestionResponse,
    onEditSuccess?: (question: QuestionResponse) => void
}) {
    const [editContentValue, setEditContentValue] = useState(question.content);
    const [editTitleValue, setEditTitleValue] = useState(question.title);
    const [editTagIds, setEditTagIds] = useState(question.tags.map(e => e.id));
    const [editTags, setEditTags] = useState(question.tags);
    const [editComment, setEditComment] = useState('');
    const [isAnyChange, setIsAnyChange] = useState(false);

    const auth = getAuth();

    const handleSend = async () => {
        const requestUrl = formatString(backendURL + Apis.Question.Update, question.id);

        const response = await putFetcher([requestUrl, auth!.accessToken, JSON.stringify({
            id: question.id,
            title: editTitleValue,
            content: editContentValue,
            tags: editTagIds,
            comment: editComment
        })]);

        if (!IsErrorResponse(response)) {
            question.content = editContentValue;
            notifySucceed('Question updated successfully');
            onEditSuccess?.({
                ...question,
                title: editTitleValue,
                content: editContentValue,
                tags: editTags
            });
        }
    }

    useEffect(() => {
        setIsAnyChange(
            editContentValue !== question.content
            || editTitleValue !== question.title);
    }, [editContentValue, editTitleValue])

    const handleTagChange = (tags: TagResponse[]) => {
        setEditTags(tags);
        setIsAnyChange(true);
        console.log(tags)
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex justify-between items-center">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Edit Question</h2>
                    <p className="mt-1 text-sm text-gray-500">Update your question details</p>
                </div>

                <div className="gap-3">
                    <button
                        onClick={handleSend}
                        disabled={!isAnyChange}
                        className="flex items-center px-2 py-1 rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                        Update
                    </button>
                </div>
            </div>
            <div className="px-6 space-y-6">
                <div className="space-y-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Question Title
                        <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                        id="title"
                        value={editTitleValue}
                        onChange={(e) => setEditTitleValue(e.target.value)}
                        type="text"
                        spellCheck={false}
                        name="title"
                        required
                        placeholder="Enter your question title"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Question Content
                        <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <TextEditor
                            currentText={editContentValue}
                            onTextChange={setEditContentValue}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Tags
                        <span className="text-xs text-gray-500 ml-2">(Max 5 tags)</span>
                    </label>
                    <TagInput
                        onTagChange={handleTagChange}
                        onTagIdChange={setEditTagIds}
                        maxTags={5}
                        defaultTags={question.tags}
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                        Comment
                        <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                        id="comment"
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        type="text"
                        spellCheck={false}
                        autoComplete="off"
                        name="comment"
                        required
                        placeholder="Enter your comment"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 transition-all"
                    />
                </div>
            </div>
        </div>
    );
}