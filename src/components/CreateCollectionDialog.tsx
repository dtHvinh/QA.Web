'use client'

import getAuth from "@/helpers/auth-utils";
import { IsErrorResponse, postFetcher } from "@/helpers/request-utils";
import { ErrorResponse } from "@/props/ErrorResponse";
import { backendURL } from "@/utilities/Constants";
import notifyError from "@/utilities/ToastrExtensions";
import { Close, Lock, Public } from "@mui/icons-material";
import { Dialog, DialogContent, FormControlLabel, IconButton, Radio, RadioGroup, useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { FormEvent } from "react";

export default function CreateCollectionDialog({ open, onClose, onCreated }: {
    open: boolean,
    onClose?: () => void,
    onCreated?: () => void
}) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [isPublic, setIsPublic] = React.useState<string>('false');
    const auth = getAuth();

    const handleCreateCollection = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const newCollection = {
            name: formData.get('title') as string,
            description: formData.get('description') as string,
            isPublic: isPublic === 'true'
        }

        const response = await postFetcher([`${backendURL}/api/collection`, auth!.accessToken, JSON.stringify(newCollection)])

        if (IsErrorResponse(response)) {
            notifyError((response as ErrorResponse)?.title || "Error");
            return;
        }

        if (onClose)
            onClose();

        if (onCreated)
            onCreated();
    }

    return (
        <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: '16px',
                    }
                }
            }}
        >
            <DialogContent>
                <div className="pt-6 px-6 border-b border-gray-100">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900">Create Collection</h2>
                        <IconButton
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                            size="small"
                        >
                            <Close />
                        </IconButton>
                    </div>
                </div>

                <form className="p-6 space-y-6" method="POST" onSubmit={handleCreateCollection}>
                    <div className="space-y-2">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Collection Title
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                            type="text"
                            spellCheck={false}
                            name="title"
                            required
                            placeholder="Enter collection title"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                            <span className="text-xs text-gray-500 ml-2">(optional)</span>
                        </label>
                        <input
                            spellCheck={false}
                            name="description"
                            placeholder="Brief description of your collection"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                            Visibility Settings
                        </label>
                        <RadioGroup
                            value={isPublic}
                            onChange={(e) => setIsPublic(e.target.value)}
                            className="space-y-2"
                        >
                            <FormControlLabel
                                value="true"
                                className={`w-full m-0 rounded-lg transition-colors ${isPublic === 'true' ? 'bg-blue-50' : 'hover:bg-gray-50'
                                    }`}
                                control={
                                    <Radio
                                        icon={<Public className="text-gray-400" />}
                                        checkedIcon={<Public className="text-blue-600" />}
                                    />
                                }
                                label={
                                    <div className="py-2">
                                        <p className="font-medium text-gray-900">Public</p>
                                        <p className="text-sm text-gray-500">Visible to everyone</p>
                                    </div>
                                }
                            />
                            <FormControlLabel
                                value="false"
                                className={`w-full m-0 rounded-lg transition-colors ${isPublic === 'false' ? 'bg-blue-50' : 'hover:bg-gray-50'
                                    }`}
                                control={
                                    <Radio
                                        icon={<Lock className="text-gray-400" />}
                                        checkedIcon={<Lock className="text-blue-600" />}
                                    />
                                }
                                label={
                                    <div className="py-2">
                                        <p className="font-medium text-gray-900">Private</p>
                                        <p className="text-sm text-gray-500">Only visible to you</p>
                                    </div>
                                }
                            />
                        </RadioGroup>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-100">
                        <button
                            type="submit"
                            className="px-6 py-2.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                            Create Collection
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}