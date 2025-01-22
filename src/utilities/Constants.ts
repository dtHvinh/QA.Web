export const AppName = "Q&A";

export const Routes = {
    Home: "/",
    Auth: {
        Login: "/auth/login",
        Register: "/auth/register",
    },
    NewQuestion: "/new-question",
    Questions: "/questions",
    YourQuestions: "/your-questions",
    Tags: "/tags",
    Bookmarks: "/bookmarks",
    Profile: "/profile",
    Settings: "/settings",
    Logout: "/logout",
}

export const Apis = {
    Auth: {
        Login: "/api/auth/login",
        Register: "/api/auth/register",
        Logout: "/api/auth/logout",
    },
    Question: {
        GetQuestionDetail: "/api/question",
        Create: "/api/question",
        CreateComment: "/api/question",
        GetYourQuestions: "/api/question",
        Update: "/api/question",
        Delete: "/api/question",
        Vote: "/api/question/vote",
        Bookmark: "/api/question/bookmark",
        CreateAnswer: "/api/question/{0}/answer",
    },
    Tag: {
        Create: "/api/tag",
        Update: "/api/tag",
        Delete: "/api/tag",
    },
    User: {
        Update: "/api/user",
        Delete: "/api/user",
    },
    Comment: {
        Delete: "/api/comment/{0}",
        Update: "/api/comment/{0}",
    }
}

export const backendURL = process.env.NEXT_PUBLIC_BACKEND_HOST
