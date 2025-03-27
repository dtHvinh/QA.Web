import { GetUserResponse } from "@/types/types";
import { Block, Person, Shield } from "@mui/icons-material";
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
        <td colSpan={colSpan} className="bg-[var(--card-background)] p-6 animate-fadeIn text-[var(--text-primary)]">

            <div className="space-y-6">
                <Tabs.Root defaultValue="user-details" className="grid grid-cols-3 gap-6">
                    <div className="col-span-1 space-y-4">
                        <h3 className="font-medium text-[var(--text-primary)]">Quick Actions</h3>
                        <Tabs.List className="space-y-2">
                            <Tabs.Trigger value="user-details"
                                className="w-full flex items-center gap-2 px-4 py-2 text-teal-600 dark:text-teal-400 
                                    bg-teal-100 dark:bg-teal-900/20 rounded-lg hover:bg-teal-200 dark:hover:bg-teal-900/30">
                                <Person className="text-teal-600 dark:text-teal-400" fontSize="small" />
                                <span>User Details</span>
                            </Tabs.Trigger>
                            <Tabs.Trigger value="ban"
                                className="w-full flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 
                                    bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30">
                                <Block className="text-red-600 dark:text-red-400" fontSize="small" />
                                <span>Ban</span>
                            </Tabs.Trigger>
                            <Tabs.Trigger value="roles"
                                className="w-full flex items-center gap-2 px-4 py-2 text-purple-600 dark:text-purple-400 
                                    bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30">
                                <Shield className="text-purple-600 dark:text-purple-400" fontSize="small" />
                                <span>Manage Roles</span>
                            </Tabs.Trigger>
                        </Tabs.List>
                    </div>
                    <div className="col-span-2 space-y-4">
                        <Tabs.Content value="user-details">
                            <h3 className="font-medium text-[var(--text-primary)]">User Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-[var(--text-secondary)]">Account Created</p>
                                    <p className="font-medium text-[var(--text-primary)]">{new Date(user.createdAt).toLocaleDateString()}</p>
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