export const AppName = "Q&A";

export const Routes = {
    Home: "/",
    Auth: {
        Login: "/auth/login",
        Register: "/auth/register",
    },
    Questions: "/questions",
    Tags: "/tags",
    Bookmarks: "/bookmarks",
    Profile: "/profile",
    Settings: "/settings",
    Logout: "/logout",
}

export const backendURL = process.env.NEXT_PUBLIC_BACKEND_HOST