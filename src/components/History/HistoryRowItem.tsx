import timeFromNow from "@/helpers/time-utils";
import { QuestionHistoryResponse } from "@/types/types";
import { useState } from "react";

export default function HistoryRowItem({ history }: { history: QuestionHistoryResponse }) {
    const [isCommentExpanded, setIsCommentExpanded] = useState(false)
    const toggleCommentExpansion = () => setIsCommentExpanded(!isCommentExpanded)
    const textTrunCateThreshold = 138

    const getTypeBadgeClass = (type: string) => {
        const baseClass = "inline-flex px-3.5 py-1.5 text-xs font-medium rounded-full whitespace-nowrap"
        switch (type.toLowerCase()) {
            case 'edit':
                return `${baseClass} bg-[var(--primary-light)] text-[var(--primary)]`
            case 'created':
                return `${baseClass} bg-[var(--success-light)] text-[var(--success)]`
            case 'flag duplicate':
                return `${baseClass} bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400`
            case 'remove duplicate flag':
                return `${baseClass} bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400`
            case 'close question':
                return `${baseClass} bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400`
            case 're-open question':
                return `${baseClass} bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400`
            case 'add comment':
                return `${baseClass} bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400`
            case 'add answer':
                return `${baseClass} bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400`
            case 'accept answer':
                return `${baseClass} bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400`
            default:
                return `${baseClass} bg-[var(--hover-background)] text-[var(--text-secondary)]`
        }
    }

    return (
        <tr className="hover:bg-[var(--hover-background)] transition-colors">
            <td className="py-3 px-6 text-sm text-[var(--text-secondary)]">
                {timeFromNow(history.createdAt)}
            </td>
            <td className="py-4 px-9">
                <span className={getTypeBadgeClass(history.questionHistoryType)}>
                    {history.questionHistoryType.toLowerCase()}
                </span>
            </td>
            <td className="py-3 px-6 text-sm">
                <span className="font-medium text-[var(--text-primary)]">
                    {history.authorName}
                </span>
            </td>
            <td className="py-3 px-6 text-sm text-[var(--text-secondary)]">
                <div
                    onClick={toggleCommentExpansion}
                    className={`prose prose-sm max-w-none dark:prose-invert cursor-pointer
                        ${isCommentExpanded ? '' : 'line-clamp-2'} [&>a]:text-blue-500 [&>a]:underline`}
                    dangerouslySetInnerHTML={{ __html: history.comment }}
                />
                {history.comment.length > textTrunCateThreshold && !isCommentExpanded && (
                    <button
                        onClick={toggleCommentExpansion}
                        className="text-[var(--text-primary)] text-xs mt-1 bg-[var(--hover-background)] px-2 rounded-md"
                    >
                        More
                    </button>
                )}
            </td>
        </tr>
    )
}