import getAuth from "@/helpers/auth-utils";
import { getFetcher, postFetcher } from "@/helpers/request-utils";
import notifyError from "@/utilities/ToastrExtensions";

export async function addQuestionToCollection(questionId: string, collectionId: string) {
    const auth = getAuth();

    return await postFetcher([
        `/api/collection/${collectionId}/add/${questionId}`,
        auth!.accessToken, ''])
}

export async function deleteQuestionFromCollection(questionId: string, collectionId: string) {
    const auth = getAuth();

    return await postFetcher([
        `/api/collection/${collectionId}/delete/${questionId}`,
        auth!.accessToken, ''])
}

export async function isAllowedTo(action: string, callback?: () => void) {
    const auth = getAuth();
    const res: { isAllowed: boolean, reputationReq: number } = await getFetcher([`/api/user/is_allow_to/${action}`, auth!.accessToken])
    if (!res.isAllowed) {
        notifyError(
            `You need atleast ${res.reputationReq} reputation to perform this action`,
            { horizontal: "center", vertical: "top" },
            2);
    }
    else
        callback?.();

    return res.isAllowed;
}