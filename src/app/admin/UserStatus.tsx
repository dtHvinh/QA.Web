import { GetUserResponse } from "@/types/types";

export default function UserStatus({ user }: { user: GetUserResponse }) {
    if (user.isBanned)
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Banned
        </span>

    if (user.isDeleted)
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Deleted
        </span>

    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Active
    </span>
}