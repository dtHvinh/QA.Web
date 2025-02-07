import RoundedButton from "@/components/RoundedButton";
import React from "react";
import {QuestionResponse} from "@/types/types";
import getAuth from "@/helpers/auth-utils";
import {backendURL, Routes} from "@/utilities/Constants";
import {fetcher, IsErrorResponse} from "@/helpers/request-utils";
import notifyError, {notifySucceed} from "@/utilities/ToastrExtensions";
import {ErrorResponse} from "@/props/ErrorResponse";
import AlertDialog from "@/components/AlertDialog";
import {useRouter} from "next/navigation";

interface QuestionSectionOptionsProps {
    question: QuestionResponse,
    onQuestionClose?: () => void
}

export default function QuestionSectionOptions(
    {
        question,
        onQuestionClose,
    }: QuestionSectionOptionsProps) {
    const [isSettingOpen, setIsSettingOpen] = React.useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
    const [closeConfirmOpen, setCloseConfirmOpen] = React.useState(false);
    const auth = getAuth();
    const router = useRouter();

    const handleDeleteQuestion = async () => {
        const response = await fetcher([
            'DELETE',
            `${backendURL}/api/question/${question.id}`,
            auth!.accessToken, '']);

        if (IsErrorResponse(response)) {
            notifyError((response as ErrorResponse).errors);
        } else {
            notifySucceed('Question deleted');
            router.push(Routes.YourQuestions);
        }

        setIsSettingOpen(false);
    }

    const handleReOpenQuestion = async () => {

    }

    const handleCloseQuestion = async () => {
        const response = await fetcher([
            'PUT',
            `${backendURL}/api/question/${question.id}/close`,
            auth!.accessToken, '']);

        if (IsErrorResponse(response)) {
            notifyError((response as ErrorResponse).errors);
        } else {
            notifySucceed('Question closed');
            onQuestionClose?.();
        }

        setIsSettingOpen(false);
    }

    return (
        <div>
            <AlertDialog open={deleteConfirmOpen}
                         title={'Do you want to delete this question'}
                         description={'This action cannot be undone'}
                         onClose={() => setDeleteConfirmOpen(false)}
                         onYes={handleDeleteQuestion}/>

            <AlertDialog open={closeConfirmOpen}
                         title={'Do you want to close this question'}
                         description={'This action cannot be undone'}
                         onClose={() => setCloseConfirmOpen(false)}
                         onYes={handleCloseQuestion}/>

            <RoundedButton
                title={'Settings'}
                svg={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                          className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                    <path
                        d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                </svg>}
                onClick={() => setIsSettingOpen(!isSettingOpen)}
            />
            <div
                className={`${isSettingOpen ? "" : "hidden"} mt-3 z-10 shadow-xl absolute w-56 rounded-md bg-white ring-1 ring-black ring-opacity-5`}>
                <div className="" role="menu" aria-orientation="vertical"
                     aria-labelledby="dropdown-button">
                    <button
                        className="flex w-full items-center gap-2 p-2 mb-1 text-sm text-gray-700 bg-white hover:bg-gray-100"
                        role="menuitem">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             className="bi bi-flag-fill" viewBox="0 0 16 16">
                            <path
                                d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12 12 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A20 20 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a20 20 0 0 0 1.349-.476l.019-.007.004-.002h.001"/>
                        </svg>
                        Report
                    </button>
                    {!question.isClosed &&
                        <button
                            className="flex w-full items-center gap-2 p-2 mb-1 text-sm text-gray-700 bg-white hover:bg-gray-100"
                            role="menuitem"
                            onClick={handleCloseQuestion}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                <path
                                    d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                            </svg>
                            Close this question
                        </button>
                        ||
                        <button
                            className="flex w-full items-center gap-2 p-2 mb-1 text-sm text-gray-700 bg-white hover:bg-gray-100"
                            role="menuitem"
                            onClick={handleReOpenQuestion}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 className="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
                                <path fillRule="evenodd"
                                      d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
                                <path
                                    d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
                            </svg>
                            Re-open this question
                        </button>
                    }
                    <button
                        className="flex w-full items-center gap-2 p-2 mb-1 text-sm text-red-500 bg-white hover:bg-red-100"
                        role="menuitem"
                        onClick={() => setDeleteConfirmOpen(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             className="bi bi-trash3" viewBox="0 0 16 16">
                            <path
                                d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                        </svg>
                        Delete this question
                    </button>
                </div>
            </div>
        </div>);
}