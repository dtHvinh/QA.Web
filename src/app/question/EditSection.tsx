import {QuestionResponse, TagResponse} from "@/types/types";
import TextEditor from "@/components/TextEditor";
import React, {useState} from "react";
import {formatString} from "@/helpers/string-utils";
import {Apis, backendURL} from "@/utilities/Constants";
import {IsErrorResponse, putFetcher} from "@/helpers/request-utils";
import notifyError, {notifySucceed} from "@/utilities/ToastrExtensions";
import {ErrorResponse} from "@/props/ErrorResponse";
import getAuth from "@/helpers/auth-utils";
import TagInput from "@/components/TagInput";

export default function EditSection({question, onEditSuccess}: {
    question: QuestionResponse,
    onEditSuccess?: (question: QuestionResponse) => void
}) {
    const [editContentValue, setEditContentValue] = useState(question.content);
    const [editTitleValue, setEditTitleValue] = useState(question.title);
    const [editTagIds, setEditTagIds] = useState(question.tags.map(e => e.id));
    const [editTags, setEditTags] = useState(question.tags);
    const auth = getAuth();

    const handleSend = async () => {
        const requestUrl = formatString(backendURL + Apis.Question.Update, question.id);

        const response = await putFetcher([requestUrl, auth!.accessToken, JSON.stringify({
            id: question.id,
            title: editTitleValue,
            content: editContentValue,
            tags: editTagIds
        })]);

        if (IsErrorResponse(response)) {
            notifyError((response as ErrorResponse).title);
        } else {
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

    const handleTagChange = (tags: TagResponse[]) => {
        setEditTags(tags);
    }

    return (
        <div>
            <div className="space-y-2 mb-5">
                <label htmlFor="title" className="block text-xl font-medium text-gray-700">Title</label>
                <input
                    defaultValue={editTitleValue}
                    onChange={(e) => setEditTitleValue(e.target.value)}
                    type="text"
                    spellCheck={false}
                    name="title"
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-blue-600"/>
            </div>

            <label className="block text-xl mb-2 font-medium text-gray-700">Content</label>
            <TextEditor currentText={editContentValue}
                        onTextChange={setEditContentValue}/>

            <label className="block text-xl my-2 font-medium text-gray-700">Tags</label>
            <TagInput onTagChange={handleTagChange} onTagIdChange={setEditTagIds} maxTags={5}
                      defaultTags={question.tags}/>

            <div className={'w-full text-end mt-5'}>
                <button onClick={handleSend}
                        disabled={editContentValue.length == 0}
                        className={'space-x-3 disabled:bg-gray-200 p-2 bg-blue-200 rounded-lg hover:bg-blue-300 active:scale-95 transition-all'}>
                    <div className={'inline-block mt-1'}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             viewBox="0 0 16 16">
                            <path
                                d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"/>
                        </svg>
                    </div>

                    <span className={'inline-block'}>Send</span>
                </button>
            </div>
        </div>
    );
}