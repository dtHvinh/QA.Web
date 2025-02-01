import {Routes} from "@/utilities/Constants";

export function toQuestionPage(id: string, slug: string): string {
    return Routes.Question + `/${id}/${slug}/`;
}

export function toWikiPage(id: string, name: string): string {
    return Routes.Wiki + `/${id}/${name}/`;
}