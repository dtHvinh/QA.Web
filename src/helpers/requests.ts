import getAuth from "@/helpers/auth-utils";
import { getFetcher, postFetcher } from "@/helpers/request-utils";

export async function addQuestionToCollection(questionId: string, collectionId: string) {
    const auth = getAuth();

    return await postFetcher(`/api/collection/${collectionId}/add/${questionId}`)
}

export async function deleteQuestionFromCollection(questionId: string, collectionId: string) {
    const auth = getAuth();

    return await postFetcher(`/api/collection/${collectionId}/delete/${questionId}`)
}

export async function isAllowedTo(action: string) {
    const auth = getAuth();
    const res: { isAllowed: boolean, reputationReq: number } = await getFetcher(`/api/user/is_allow_to/${action}`)
    return res;
}