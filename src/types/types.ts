export interface TagResponse {
    id: string,
    name: string,
    description: string,
    wikiBody: string,
    questionCount: number
}

export interface QuestionHistoryResponse {
    id: string,
    createdAt: string,
    updatedAt: string,
    authorId: string,
    authorName: string,
    comment: string,
    questionHistoryType: 'Edit' | 'Close' | 'Reopen' | 'Add Comment' | 'Add Answer' | 'Accept Answer',
}

export interface BookmarkResponse {
    id: string,
    createdAt: string,
    question: QuestionResponse
}

export interface TagDetailResponse {
    id: string,
    name: string,
    description: string,
    questionCount: number
    wikiBody: string,
    questions: PagedResponse<QuestionResponse>
}

export interface ResourceRightProps {
    resourceRight: ResourceRight
}

export type ResourceRight = "Owner" | "Viewer";

export interface CreateQuestionResponse {
    id: string,
    title: string,
    content: string,
    slug: string,
    tags: TagResponse[],
}

export interface PagedResponse<T> {
    pageIndex: number,
    pageSize: number,
    hasNextPage: boolean,
    hasPreviousPage: boolean,
    totalCount: number,
    totalPage: number,
    items: T[],
}

export interface QuestionResponse extends ResourceRightProps {
    id: string,
    title: string,
    content: string,
    slug: string,
    tags: TagResponse[],

    author: AuthorResponse,

    upvote: number,
    downvote: number,

    createdAt: string,
    updatedAt: string,

    viewCount: number,
    commentCount: number,
    answerCount: number,

    isDuplicate: boolean,
    isClosed: boolean,
    isDraft: boolean,
    isSolved: boolean,
    isBookmarked: boolean,

    comments: CommentResponse[],
    answers: AnswerResponse[],
    histories: QuestionHistoryResponse[],
}

export interface AuthorResponse {
    id: string;
    firstName?: string;
    lastName?: string;
    username: string;
    reputation: number;
    profilePicture: string;
}

export interface VoteResponse {
    currentUpvote: number,
    currentDownvote: number,
}

export interface UserResponse {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    reputation: number;
    profilePicture: string;
    dateJoined: string;
    lastActive: string;
    bio: string;
}

export interface CommentResponse extends ResourceRightProps {
    id: string;
    createdAt: string;
    updatedAt: string;
    content?: string;
    author?: AuthorResponse;
}

export interface AnswerResponse extends ResourceRightProps {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    upvote: number;
    downvote: number;
    isAccepted: boolean;
    author?: AuthorResponse;
    resourceRight: ResourceRight;
}

export interface YourQuestionList {
    pageIndex: number,
    pageSize: number,
    hasNextPage: boolean,
    hasPreviousPage: boolean,
    items: QuestionResponse[],
}