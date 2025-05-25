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
        <div className="bg-[var(--card-background)] min-h-screen shadow-lg border border-[var(--border-color)]">
            <div className="border-b border-[var(--border-color)] bg-[var(--hover-background)]">
                <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                        <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                            <svg className="w-5 h-5 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit Question
                        </h2>
                        <p className="mt-1 text-sm text-[var(--text-secondary)]">Make your question more clear and helpful</p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button
                            onClick={onClose}
                            className="flex-1 sm:flex-none px-4 py-2 rounded-lg text-[var(--text-secondary)] 
                                hover:bg-[var(--background)] transition-colors flex items-center justify-center gap-2"
                        >
                            <Close fontSize="small" />
                            Cancel
                        </button>
                        <button
                            onClick={handleSend}
                            disabled={!isAnyChange || isEditing}
                            className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-[var(--primary)] text-white 
                                hover:bg-[var(--primary-darker)] disabled:opacity-50 disabled:cursor-not-allowed 
                                transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            {isEditing ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span className="hidden sm:inline">Updating...</span>
                                    <span className="sm:hidden">...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="hidden sm:inline">Save Changes</span>
                                    <span className="sm:hidden">Save</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6">
                <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-2">
                        <svg className="w-4 h-4 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                        Title
                        <span className="text-[var(--error)]">*</span>
                    </label>
                    <input
                        id="title"
                        value={editTitleValue}
                        onChange={(e) => setEditTitleValue(e.target.value)}
                        type="text"
                        spellCheck={false}
                        required
                        placeholder="Enter your question title"
                        className="w-full px-4 py-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--input-background)] 
                            text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] transition-all
                            focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] focus:ring-opacity-20"
                    />
                </div>

                <div className="space-y-2">
                    <label className=" text-sm font-medium text-[var(--text-primary)] flex items-center gap-2">
                        <svg className="w-4 h-4 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Content
                        <span className="text-[var(--error)]">*</span>
                    </label>
                    <div className="border border-[var(--border-color)] text-[var(--text-primary)] rounded-lg overflow-hidden focus-within:border-[var(--primary)] transition-colors">
                        <TextEditor
                            currentText={editContentValue}
                            onTextChange={setEditContentValue}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-2">
                        <svg className="w-4 h-4 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        Tags
                        <span className="text-xs text-[var(--text-secondary)]">(Max 5 tags)</span>
                    </label>
                    <TagInput
                        onTagChange={handleTagChange}
                        onTagIdChange={setEditTagIds}
                        maxTags={5}
                        defaultTags={question.tags}
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="comment" className=" text-sm font-medium text-[var(--text-primary)] flex items-center gap-2">
                        <svg className="w-4 h-4 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        Edit Summary
                        <span className="text-[var(--error)]">*</span>
                    </label>
                    <input
                        id="comment"
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        type="text"
                        spellCheck={false}
                        autoComplete="off"
                        required
                        placeholder="Briefly describe your changes"
                        className="w-full px-4 py-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--input-background)] 
                            text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] transition-all
                            focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] focus:ring-opacity-20"
                    />
                </div>
            </div>
        </div>
    );
}