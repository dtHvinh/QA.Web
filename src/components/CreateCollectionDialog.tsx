'use client'

import {Dialog, DialogContent, FormControlLabel, IconButton, Radio, RadioGroup, useTheme} from "@mui/material";
import {Close, Lock, Public} from "@mui/icons-material";
import React, {FormEvent} from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import getAuth from "@/helpers/auth-utils";
import {IsErrorResponse, postFetcher} from "@/helpers/request-utils";
import {backendURL} from "@/utilities/Constants";
import notifyError from "@/utilities/ToastrExtensions";
import {ErrorResponse} from "@/props/ErrorResponse";

export default function CreateCollectionDialog({open, onClose, onCreated}: {
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
            hideBackdrop={true}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogContent>
                <div className={'font-bold flex justify-between text-2xl items-center'}>
                    <div>Create Collection</div>
                    <div><IconButton disableRipple={true} onClick={onClose}><Close/></IconButton></div>
                </div>
                <form className="mt-4 space-y-4" method="POST" onSubmit={handleCreateCollection}>
                    <div className="space-y-2">
                        <label htmlFor="title"
                               className="block text-xl font-medium text-gray-700">Title:</label>
                        <input
                            type="text"
                            spellCheck={false}
                            name="title"
                            required
                            className="w-full md:w-[500px] p-2 border border-gray-300 rounded-lg focus:outline-blue-600"/>
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label htmlFor="description"
                               className="block text-xl font-medium text-gray-700">Description:
                            <small className={'ml-2 text-gray-400'}>(optional)</small>
                        </label>
                        <input
                            spellCheck={false}
                            name="description"
                            className="w-full md:w-[500px] p-2 border border-gray-300 rounded-lg focus:outline-blue-600"/>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="description"
                               className="block text-xl font-medium text-gray-700">Visibility
                        </label>
                        <RadioGroup
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="controlled-radio-buttons-group"
                            value={isPublic}
                            className={'gap-4'}
                            onChange={(e) => setIsPublic(e.target.value)}
                        >
                            <FormControlLabel value="true"
                                              className={`
                                                ${isPublic === 'false' ? 'text-gray-300' : ''} hover:bg-gray-100 p-2 rounded-lg
                                              `}
                                              control={<Radio icon={<Public/>}
                                                              checkedIcon={<Public/>}
                                                              checked={isPublic === 'true'}/>}
                                              label={
                                                  <div className={'flex flex-col'}>
                                                      <span className={'font-bold'}>Public</span>
                                                      <small>
                                                          This collection will visible for
                                                          everyone
                                                      </small>
                                                  </div>}/>
                            <FormControlLabel value="false"
                                              className={`
                                                ${isPublic === 'true' ? 'text-gray-300' : ''} hover:bg-gray-100 p-2 rounded-lg
                                              `}
                                              control={<Radio icon={<Lock/>}
                                                              color={'error'}
                                                              checkedIcon={<Lock/>}
                                                              checked={isPublic === 'false'}/>}
                                              label={
                                                  <div className={'flex flex-col'}>
                                                      <span className={'font-bold'}>Private</span>
                                                      <small>
                                                          This collection will not visible for
                                                          everyone
                                                      </small>
                                                  </div>
                                              }/>
                        </RadioGroup>
                    </div>

                    <div className={'flex justify-end'}>
                        <button className={'text-green-700 py-2'} onClick={() => console.log("e")}
                                autoFocus>
                            Create
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}