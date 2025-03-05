import getAuth from "@/helpers/auth-utils";
import { deleteFetcher, IsErrorResponse, putFetcher } from "@/helpers/request-utils";
import { ErrorResponse } from "@/props/ErrorResponse";
import { GetCollectionDetailResponse } from "@/types/types";
import { backendURL } from "@/utilities/Constants";
import notifyError, { notifySucceed } from "@/utilities/ToastrExtensions";
import { Lock, Public } from "@mui/icons-material";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { AlertDialog } from "radix-ui";
import React, { FormEvent } from "react";

import { useRouter } from "next/navigation";
import './collection-settings.css';

export default function CollectionSettings({ collection }: { collection: GetCollectionDetailResponse }) {
    const [anyChange, setAnyChange] = React.useState(false);
    const [isPublic, setIsPublic] = React.useState(collection.isPublic ? 'true' : 'false');
    const [inputValue, setInputValue] = React.useState('');
    const auth = getAuth();
    const router = useRouter();

    const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const updateModel = {
            id: collection.id,
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            isPublic: isPublic === 'true'
        }

        const res = await putFetcher([`${backendURL}/api/collection`, auth!.accessToken, JSON.stringify(updateModel)])

        if (IsErrorResponse(res)) {
            notifyError((res as ErrorResponse).title);
            return;
        }

        setAnyChange(false);
        notifySucceed('Collection updated successfully');
    }

    const handleDelete = async () => {
        const res = await deleteFetcher([`${backendURL}/api/collection/${collection.id}`, auth!.accessToken])

        if (IsErrorResponse(res)) {
            notifyError((res as ErrorResponse).title);
            return;
        }

        notifySucceed('Collection deleted successfully');
        router.push('/your-collections');
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <form onSubmit={handleUpdate} className="space-y-8">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">General Settings</h2>

                    <div className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Collection name
                            </label>
                            <input
                                type="search"
                                id="name"
                                name="name"
                                maxLength={25}
                                spellCheck={false}
                                onChange={() => setAnyChange(true)}
                                defaultValue={collection.name}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg transition-colors"
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                spellCheck={false}
                                onChange={() => setAnyChange(true)}
                                defaultValue={collection.description}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg transition-colors resize-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-red-50 rounded-xl border-2 border-red-200 p-6">
                    <h2 className="text-2xl font-bold text-red-700 mb-6">Danger Zone</h2>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-4">
                                Visibility
                            </label>
                            <RadioGroup
                                value={isPublic}
                                onChange={(e) => {
                                    setIsPublic(e.target.value);
                                    setAnyChange(true);
                                }}
                                className="space-y-3"
                            >
                                <FormControlLabel
                                    value="true"
                                    className={`w-full rounded-lg p-3 transition-colors ${isPublic === 'true' ? 'bg-white shadow-sm' : 'hover:bg-white/50'
                                        }`}
                                    control={
                                        <Radio
                                            icon={<Public className="text-gray-400" />}
                                            checkedIcon={<Public className="text-blue-600" />}
                                        />
                                    }
                                    label={
                                        <div className="ml-2">
                                            <div className="font-medium text-gray-900">Public</div>
                                            <div className="text-sm text-gray-500">
                                                This collection will be visible to everyone
                                            </div>
                                        </div>
                                    }
                                />
                                <FormControlLabel
                                    value="false"
                                    className={`w-full rounded-lg p-3 transition-colors ${isPublic === 'false' ? 'bg-white shadow-sm' : 'hover:bg-white/50'
                                        }`}
                                    control={
                                        <Radio
                                            icon={<Lock className="text-gray-400" />}
                                            checkedIcon={<Lock className="text-red-600" />}
                                        />
                                    }
                                    label={
                                        <div className="ml-2">
                                            <div className="font-medium text-gray-900">Private</div>
                                            <div className="text-sm text-gray-500">
                                                This collection will not be visible to others
                                            </div>
                                        </div>
                                    }
                                />
                            </RadioGroup>
                        </div>

                        <div className="pt-4 border-t border-red-200">
                            <label className="block text-sm font-medium text-gray-700 mb-4">
                                Delete Collection
                            </label>
                            <AlertDialog.Root>
                                <AlertDialog.Trigger asChild>
                                    <button className="px-4 py-2 bg-red-100 text-red-700 border border-red-300 rounded-lg hover:bg-red-200 transition-colors">
                                        Delete Collection
                                    </button>
                                </AlertDialog.Trigger>
                                <AlertDialog.Portal>
                                    <AlertDialog.Overlay className="fixed inset-0 bg-black/50" />
                                    <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-md w-full bg-white rounded-xl p-6 shadow-xl">
                                        <AlertDialog.Title className="text-xl font-bold text-gray-900 mb-4">
                                            Delete Collection?
                                        </AlertDialog.Title>
                                        <AlertDialog.Description className="text-gray-600 mb-6">
                                            This action cannot be undone. This will permanently delete the collection.
                                        </AlertDialog.Description>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm text-gray-700 mb-2">
                                                    Type "{collection.name}" to confirm
                                                </label>
                                                <input
                                                    type="text"
                                                    value={inputValue}
                                                    onChange={(e) => setInputValue(e.target.value)}
                                                    className="w-full px-4 py-2 border border-red-300 rounded-lg focus-visible:outline-none"
                                                />
                                            </div>

                                            <div className="flex justify-end gap-3">
                                                <AlertDialog.Cancel asChild>
                                                    <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                                                        Cancel
                                                    </button>
                                                </AlertDialog.Cancel>
                                                <AlertDialog.Action asChild>
                                                    <button
                                                        disabled={inputValue !== collection.name}
                                                        onClick={handleDelete}
                                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </AlertDialog.Action>
                                            </div>
                                        </div>
                                    </AlertDialog.Content>
                                </AlertDialog.Portal>
                            </AlertDialog.Root>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={!anyChange}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}