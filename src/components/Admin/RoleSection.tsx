import { deleteFetcher, getFetcher, IsErrorResponse, postFetcher } from "@/helpers/request-utils";
import { GetUserResponse } from "@/types/types";
import { notifySucceed } from "@/utilities/ToastrExtensions";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useState } from "react";
import useSWR from "swr";

export default function RoleSection({ user }: { user: GetUserResponse }) {
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [deleteRole, setDeleteRole] = useState<string | null>(null);

    const { data: roles } = useSWR<string[]>('/api/admin/roles', getFetcher);
    const { data: userRoles, isLoading, mutate } = useSWR<{ name: string }[]>(`/api/admin/user-role/${user.id}`, getFetcher);

    const handleAddRole = async () => {
        if (!selectedRole) return;

        const response = await postFetcher(
            `/api/admin/roles/${user.id}/${selectedRole}`,
            JSON.stringify({ roleName: selectedRole }));

        if (!IsErrorResponse(response)) {
            mutate();
            setSelectedRole('');
            notifySucceed('Role add successfully');
        }
    };

    const handleDeleteRole = async () => {
        if (!deleteRole) return;

        const response = await deleteFetcher(
            `/api/admin/roles/${user.id}/${deleteRole}`);

        if (!IsErrorResponse(response)) {
            mutate();
            notifySucceed('Role remove successfully');
        }
        setDeleteRole(null);
    };

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-medium text-[var(--text-primary)]">Manage User Roles</h3>
                <p className="text-sm text-[var(--text-secondary)] mt-1">Assign or remove roles for this user</p>
            </div>

            {isLoading ? (
                <div className="text-[var(--text-secondary)]">Loading roles...</div>
            ) : (
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                        {userRoles?.map(({ name }, idx) => (
                            <button
                                key={idx}
                                onClick={() => setDeleteRole(name)}
                                className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 dark:bg-purple-900/20 
                                    text-purple-700 dark:text-purple-400 rounded-full text-sm hover:bg-purple-200 
                                    dark:hover:bg-purple-900/30 transition-colors"
                            >
                                {name}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-3">
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="flex-1 px-3 py-2 bg-[var(--card-background)] text-[var(--text-primary)] 
                                border border-[var(--border-color)] rounded-lg focus:border-purple-500 
                                focus:ring-1 focus:ring-purple-500"
                        >
                            <option value="">Select a role</option>
                            {roles?.map((a, idx) => (
                                <option key={idx} value={a}>{a}</option>
                            ))}
                        </select>

                        <button
                            onClick={handleAddRole}
                            disabled={!selectedRole}
                            className="px-4 py-2 bg-purple-600 dark:bg-purple-500 text-white rounded-lg 
                                hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors 
                                disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                        >
                            Add Role
                        </button>
                    </div>
                </div>
            )}

            <Dialog
                open={!!deleteRole}
                onClose={() => setDeleteRole(null)}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    className: 'bg-[var(--card-background)] text-[var(--text-primary)]'
                }}
            >
                <DialogTitle className="text-[var(--text-primary)]">Remove Role</DialogTitle>
                <DialogContent className="text-[var(--text-secondary)]">
                    Are you sure you want to remove the role "{deleteRole}" from this user?
                </DialogContent>
                <DialogActions className="p-4">
                    <button
                        onClick={() => setDeleteRole(null)}
                        className="px-4 py-2 text-[var(--text-primary)] hover:bg-[var(--hover-background)] 
                            rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDeleteRole}
                        className="px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg 
                            hover:bg-red-700 dark:hover:bg-red-600 transition-colors ml-2"
                    >
                        Remove
                    </button>
                </DialogActions>
            </Dialog>
        </div>
    );
}