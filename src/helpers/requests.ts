import {postFetcher} from "@/helpers/request-utils";
import {backendURL} from "@/utilities/Constants";
import getAuth from "@/helpers/auth-utils";

export async function addQuestionToCollection(questionId: string, collectionId: string) {
    const auth = getAuth();

    return await postFetcher([
        `${backendURL}/api/collection/${collectionId}/add/${questionId}`,
        auth!.accessToken, ''])
}

export async function deleteQuestionFromCollection(questionId: string, collectionId: string) {
    const auth = getAuth();

    return await postFetcher([
        `${backendURL}/api/collection/${collectionId}/delete/${questionId}`,
        auth!.accessToken, ''])
}