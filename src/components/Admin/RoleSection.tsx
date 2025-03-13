import getAuth from "@/helpers/auth-utils";
import { deleteFetcher, getFetcher, IsErrorResponse, postFetcher } from "@/helpers/request-utils";
import { GetUserResponse } from "@/types/types";
import { notifySucceed } from "@/utilities/ToastrExtensions";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useState } from "react";
import useSWR from "swr";

export default function RoleSection({ user }: { user: GetUserResponse }) {
    const auth = getAuth();
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [deleteRole, setDeleteRole] = useState<string | null>(null);

    const { data: roles } = useSWR<string[]>(['/api/admin/roles', auth!.accessToken], getFetcher);
    const { data: userRoles, isLoading, mutate } = useSWR<{ name: string }[]>(
        [`/api/admin/user-role/${user.id}`, auth!.accessToken],
        getFetcher
    );

    const handleAddRole = async () => {
        if (!selectedRole) return;

        const response = await postFetcher([
            `/api/admin/roles/${user.id}/${selectedRole}`,
            auth!.accessToken,
            JSON.stringify({ roleName: selectedRole })
        ]);

        if (!IsErrorResponse(response)) {
            mutate();
            setSelectedRole('');
            notifySucceed('Role add successfully');
        }
    };

    const handleDeleteRole = async () => {
        if (!deleteRole) return;

        const response = await deleteFetcher([
            `/api/admin/roles/${user.id}/${deleteRole}`,
            auth!.accessToken
        ]);

        if (!IsErrorResponse(response)) {
            mutate();
            notifySucceed('Role remove successfully');
        }
        setDeleteRole(null);
    };

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-medium text-gray-900">Manage User Roles</h3>
                <p className="text-sm text-gray-500 mt-1">Assign or remove roles for this user</p>
            </div>

            {isLoading ? (
                <div className="text-gray-500">Loading roles...</div>
            ) : (
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                        {userRoles?.map(({ name }, idx) => (
                            <button
                                key={idx}
                                onClick={() => setDeleteRole(name)}
                                className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-700 
                                         rounded-full text-sm hover:bg-purple-200 transition-colors"
                            >
                                {name}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-3">
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            onClick={console.log}
                            className="flex-1 px-3 py-2 border rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                        >
                            <option value="">Select a role</option>
                            {roles?.map((a, idx) => (
                                <option key={idx} value={a}>{a}</option>
                            ))}
                        </select>

                        <button
                            onClick={handleAddRole}
                            disabled={!selectedRole}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 
                                     transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
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
            >
                <DialogTitle>Remove Role</DialogTitle>
                <DialogContent>
                    Are you sure you want to remove the role "{deleteRole}" from this user?
                </DialogContent>
                <DialogActions className="p-4">
                    <button
                        onClick={() => setDeleteRole(null)}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDeleteRole}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 
                                 transition-colors ml-2"
                    >
                        Remove
                    </button>
                </DialogActions>
            </Dialog>
        </div>
    );
}