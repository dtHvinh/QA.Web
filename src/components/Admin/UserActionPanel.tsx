import { GetUserResponse } from "@/types/types";
import { Block, Person, PersonOff, Shield } from "@mui/icons-material";
import { Tabs } from "radix-ui";
import BanSection from "./BanSection";
import RoleSection from "./RoleSection";

interface UserActionPanelProps {
    user: GetUserResponse;
    colSpan?: number;
    onUserBanned: (userId: number) => void;
    onUserUnban: (userId: number) => void;
}

export default function UserActionPanel({ user, colSpan, onUserBanned, onUserUnban }: UserActionPanelProps) {
    return (
        <td colSpan={colSpan} className="bg-gray-50 p-6 animate-fadeIn">

            <div className="space-y-6">
                <Tabs.Root defaultValue="user-details" className="grid grid-cols-3 gap-6">
                    <div className="col-span-1 space-y-4">
                        <h3 className="font-medium text-gray-900">Quick Actions</h3>
                        <Tabs.List className="space-y-2">
                            <Tabs.Trigger value="user-details" className="w-full flex items-center gap-2 px-4 py-2 text-gray-600 bg-teal-100 rounded-lg hover:bg-teal-200">
                                <Person className="text-gray-600" fontSize="small" />
                                <span>User Details</span>
                            </Tabs.Trigger>
                            <Tabs.Trigger value="ban" className="w-full flex items-center gap-2 px-4 py-2 text-red-600  bg-red-50 rounded-lg hover:bg-red-100">
                                <Block className="text-red-60" fontSize="small" />
                                <span>Ban</span>
                            </Tabs.Trigger>
                            <Tabs.Trigger value="roles" className="w-full flex items-center gap-2 px-4 py-2 text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100">
                                <Shield className="text-purple-600" fontSize="small" />
                                <span>Manage Roles</span>
                            </Tabs.Trigger>
                            <Tabs.Trigger value="delete" className="w-full flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
                                <PersonOff className="text-gray-600" fontSize="small" />
                                <span>Delete Account</span>
                            </Tabs.Trigger>
                        </Tabs.List>
                    </div>
                    <div className="col-span-2 space-y-4">
                        <Tabs.Content value="user-details">
                            <h3 className="font-medium text-gray-900">User Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Account Created</p>
                                    <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </Tabs.Content>

                        <Tabs.Content value="ban">
                            <BanSection user={user} onUserBanned={onUserBanned} onUserUnban={onUserUnban} />
                        </Tabs.Content>

                        <Tabs.Content value="roles">
                            <RoleSection user={user} />
                        </Tabs.Content>
                    </div>
                </Tabs.Root>
            </div>
        </td>
    );
}