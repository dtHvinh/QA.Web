import ResourceOwnerPrivilege from "@/components/Privilege/ResourceOwnerPrivilege";
import UserInfoPopup from "@/components/UserInfoPopup";
import toQuestionDetail from "@/helpers/path";
import { IsErrorResponse } from "@/helpers/request-utils";
import { deleteQuestionFromCollection } from "@/helpers/requests";
import { QuestionResponse, ResourceRight } from "@/types/types";
import { Delete } from "@mui/icons-material";
import { motion } from "framer-motion";
import Link from "next/link";

interface CollectionQuestionItemProps {
    question: QuestionResponse,
    collectionId: string,
    onRemove: (questionId: string) => void
    resourceRight: ResourceRight
}

export default function CollectionQuestionItem({ question, collectionId, onRemove, resourceRight }: CollectionQuestionItemProps) {
    const handleRemove = async () => {
        var res = await deleteQuestionFromCollection(question.id, collectionId)

        if (!IsErrorResponse(res)) {
            onRemove(question.id)
        }
    }

    return (
        <motion.div
            exit={{ opacity: 0 }}
        >
            <div className="p-6 bg-[var(--card-background)] border border-[var(--border-color)] rounded-xl 
                hover:border-[var(--primary)] hover:shadow-md 
                transition-all duration-200">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">
                            <Link href={toQuestionDetail(question.id, question.slug)}>{question.title}</Link>
                        </h3>

                        {question.content && (
                            <p className="mt-2 text-sm text-[var(--text-secondary)] line-clamp-2"
                                dangerouslySetInnerHTML={{ __html: question.content }} />
                        )}

                        <div className="mt-4 flex items-center gap-4">
                            <div className="flex items-center text-sm text-[var(--text-secondary)]">
                                <span>by</span>
                                <UserInfoPopup
                                    user={question.author}
                                    className="ml-1 font-medium text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors"
                                />
                            </div>

                            {question.tags?.map(tag => (
                                <span
                                    key={tag.id}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                        bg-[var(--tag-background)] text-[var(--tag-text)]"
                                >
                                    {tag.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    <ResourceOwnerPrivilege resourceRight={resourceRight}>
                        <button
                            onClick={handleRemove}
                            className="p-2 text-[var(--text-tertiary)] hover:text-[var(--error)] 
                                rounded-lg hover:bg-[var(--hover-background)] transition-colors"
                        >
                            <Delete className="w-5 h-5" />
                        </button>
                    </ResourceOwnerPrivilege>
                </div>
            </div>
        </motion.div>
    )
}