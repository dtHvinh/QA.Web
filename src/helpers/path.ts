export default function toQuestionDetail(id: string, slug: string, gotoSection: string = '_') {
    return `/question/${id}/${slug}?goto=${gotoSection}`
}