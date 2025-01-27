export interface TagObject {
    id: string,
    name: string,
    description: string,
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
    tags: TagObject[],
}

export interface QuestionResponse extends ResourceRightProps {
    id: string,
    title: string,
    content: string,
    slug: string,
    tags: TagObject[],

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

    comments: CommentResponse[],
    answers: AnswerResponse[],
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