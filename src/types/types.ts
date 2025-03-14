export interface TextResponse {
    message: string
}

export declare type ViewOptions = 'compact' | 'full'

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

export interface GetUserResponse {
    id: number;
    userName: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    profilePicture: string;
    createdAt: string;
    updatedAt: string;
    reputation: number;

    isDeleted: boolean;
    isBanned: boolean;
}

export interface BanInfoResponse {
    endedDate: string
    reason: string
}

export interface ResourceRightProps {
    resourceRight: ResourceRight
}

export type ResourceRight = "Owner" | "Viewer";

export type AnalyticPeriod = 'Daily' | 'Weekly' | 'Monthly' | 'Yearly'

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

    score: number,

    createdAt: string,
    updatedAt: string,

    viewCount: number,
    commentCount: number,
    answerCount: number,

    isDuplicate: boolean,
    isClosed: boolean,
    isSolved: boolean,
    isBookmarked: boolean,

    comments: CommentResponse[],
    answers: AnswerResponse[],
    histories: QuestionHistoryResponse[],
}

export interface GetCollectionResponse {
    id: string,
    name: string,
    description: string,
    likeCount: number,
    questionCount: number,
    isPublic: boolean,
    isLikedByUser: boolean,
    createdAt: string,
    author: AuthorResponse
}

export interface GetCollectionWithAddStatusResponse {
    id: string,
    name: string,
    isPublic: boolean,
    isAdded: boolean,
}

export interface GetCollectionDetailResponse {
    id: string,
    name: string,
    description: string,
    likeCount: number,
    isPublic: boolean,
    isLikedByUser: boolean,
    createdAt: string,
    author: AuthorResponse
    resourceRight: ResourceRight,
    questions: PagedResponse<QuestionResponse>
}

export interface AuthRefreshResponse {
    accessToken: string,
    refreshToken: string,
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
    score: number;
}

export interface UserResponse {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    reputation: number;
    profilePicture: string;
    createdAt: string;
    lastActive: string;
    questionCount: number;
    answerCount: number;
    totalScore: number;
    acceptedAnswerCount: number;
    commentCount: number;
    collectionCount: number;
    externalLinks: ExternalLinkResponse[];
    resourceRight: ResourceRight;
}

export interface ExternalLinkResponse {
    id: string,
    provider: string,
    url: string
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
    score: number;
    isAccepted: boolean;
    author?: AuthorResponse;
    resourceRight: ResourceRight;
}

export interface AnalyticResponse {
    currentCount: number,
    previousCount: number,
    growthPercentage: number
}

export interface YourQuestionList {
    pageIndex: number,
    pageSize: number,
    hasNextPage: boolean,
    hasPreviousPage: boolean,
    items: QuestionResponse[],
}