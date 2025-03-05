import ResourceOwnerPrivilege from "@/components/Privilege/ResourceOwnerPrivilege";
import UserInfoPopup from "@/components/UserInfoPopup";
import toQuestionDetail from "@/helpers/path";
import { QuestionResponse, ResourceRight } from "@/types/types";
import { notifyConfirm } from "@/utilities/ToastrExtensions";
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
        // var res = await deleteQuestionFromCollection(questionId, collectionId)

        // if (!IsErrorResponse(res)) {
        onRemove(question.id)
        // }
    }

    const handleRemoveConfirm = () => {
        notifyConfirm(
            "Are you sure you want to remove this question from the collection?",
            () => handleRemove())
    }

    return (
        <motion.div
            exit={{ opacity: 0 }}
        >
            <div
                className="p-6 bg-white border border-gray-200 rounded-xl 
                hover:border-blue-500 hover:shadow-md 
                transition-all duration-200">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            <Link href={toQuestionDetail(question.id, question.slug)}>{question.title}</Link>
                        </h3>

                        {question.content && (
                            <p className="mt-2 text-sm text-gray-600 line-clamp-2" dangerouslySetInnerHTML={{ __html: question.content }} />
                        )}

                        <div className="mt-4 flex items-center gap-4">
                            <div className="flex items-center text-sm text-gray-500">
                                <span>by</span>
                                <UserInfoPopup
                                    user={question.author}
                                    className="ml-1 font-medium text-gray-900 hover:text-blue-600 transition-colors"
                                />
                            </div>

                            {question.tags?.map(tag => (
                                <span
                                    key={tag.id}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
                                >
                                    {tag.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    <ResourceOwnerPrivilege resourceRight={resourceRight}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveConfirm()
                            }}
                            className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Delete className="w-5 h-5" />
                        </button>
                    </ResourceOwnerPrivilege>
                </div>
            </div>
        </motion.div>
    )
}