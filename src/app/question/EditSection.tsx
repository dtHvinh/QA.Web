import TagInput from "@/components/TagInput";
import TextEditor from "@/components/TextEditor";
import { IsErrorResponse, putFetcher } from "@/helpers/request-utils";
import { formatString } from "@/helpers/string-utils";
import { QuestionResponse, TagResponse } from "@/types/types";
import { Apis, backendURL } from "@/utilities/Constants";
import { notifySucceed } from "@/utilities/ToastrExtensions";
import { Close } from "@mui/icons-material";
import { useEffect, useState } from "react";

export default function EditSection({ question, onEditSuccess, onClose }: {
    question: QuestionResponse,
    onEditSuccess?: (question: QuestionResponse) => void
    onClose?: () => void
}) {
    const [editContentValue, setEditContentValue] = useState(question.content);
    const [editTitleValue, setEditTitleValue] = useState(question.title);
    const [editTagIds, setEditTagIds] = useState(question.tags.map(e => e.id));
    const [editTags, setEditTags] = useState(question.tags);
    const [editComment, setEditComment] = useState('');
    const [isAnyChange, setIsAnyChange] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const handleSend = async () => {
        setIsEditing(true);

        const requestUrl = formatString(backendURL + Apis.Question.Update, question.id);

        const response = await putFetcher(requestUrl, JSON.stringify({
            id: question.id,
            title: editTitleValue,
            content: editContentValue,
            tags: editTagIds,
            comment: editComment
        }));

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

        setIsEditing(false);
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
        <div className="bg-[var(--card-background)] rounded-xl shadow-sm overflow-hidden">
            <div className="flex justify-between items-center">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">Edit Question</h2>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">Update your question details</p>
                </div>

                <div className="gap-3 flex">
                    <button
                        onClick={handleSend}
                        disabled={!isAnyChange}
                        className="flex items-center px-2 py-1 rounded-lg text-white bg-[var(--primary)] hover:bg-[var(--primary-darker)] disabled:bg-[var(--disabled-background)] disabled:cursor-not-allowed transition-colors"
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
                    <button
                        onClick={onClose}
                        className="flex items-center px-2 py-1 rounded-lg text-white bg-red-500 hover:bg-[var(--primary-darker)] disabled:bg-[var(--disabled-background)] disabled:cursor-not-allowed transition-colors"
                    >
                        <Close />
                        Close
                    </button>
                </div>
            </div>
            <div className="px-6 space-y-6">
                <div className="space-y-2">
                    <label htmlFor="title" className="block text-sm font-medium text-[var(--text-primary)]">
                        Question Title
                        <span className="text-[var(--error)] ml-1">*</span>
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
                        className="w-full px-4 py-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--input-background)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] transition-all focus:border-[var(--primary)]"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-[var(--text-primary)]">
                        Question Content
                        <span className="text-[var(--error)] ml-1">*</span>
                    </label>
                    <div className="border border-[var(--border-color)] rounded-lg overflow-hidden">
                        <TextEditor
                            currentText={editContentValue}
                            onTextChange={setEditContentValue}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-[var(--text-primary)]">
                        Tags
                        <span className="text-xs text-[var(--text-secondary)] ml-2">(Max 5 tags)</span>
                    </label>
                    <TagInput
                        onTagChange={handleTagChange}
                        onTagIdChange={setEditTagIds}
                        maxTags={5}
                        defaultTags={question.tags}
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="comment" className="block text-sm font-medium text-[var(--text-primary)]">
                        Comment
                        <span className="text-[var(--error)] ml-1">*</span>
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
                        className="w-full px-4 py-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--input-background)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] transition-all focus:border-[var(--primary)]"
                    />
                </div>
            </div>
        </div>
    );
}