import {Routes} from "@/utilities/Constants";

export function toQuestionPage(id: string, slug: string): string {
    return Routes.Question + `/${id}/${slug}/`;
}