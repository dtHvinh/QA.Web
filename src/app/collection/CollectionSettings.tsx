import {GetCollectionDetailResponse} from "@/types/types";
import React, {FormEvent} from "react";
import {FormControlLabel, Radio, RadioGroup} from "@mui/material";
import {Lock, Public} from "@mui/icons-material";
import {deleteFetcher, IsErrorResponse, putFetcher} from "@/helpers/request-utils";
import {backendURL} from "@/utilities/Constants";
import getAuth from "@/helpers/auth-utils";
import notifyError, {notifySucceed} from "@/utilities/ToastrExtensions";
import {ErrorResponse} from "@/props/ErrorResponse";
import {AlertDialog} from "radix-ui";

import './collection-settings.css';
import {useRouter} from "next/navigation";

export default function CollectionSettings({collection}: { collection: GetCollectionDetailResponse }) {
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
        <div>
            <form onSubmit={handleUpdate} className={'flex flex-col gap-2'}>
                <div className={'text-2xl font-bold'}>
                    General
                </div>

                <div className={'flex flex-col'}>
                    <label htmlFor="name" className={'mt-2'}>Collection name</label>
                    <div className={'flex items-baseline gap-2'}>
                        <input className={'border p-1 px-3 mt-2 border-black rounded-lg'} type="text" id="name"
                               name="name"
                               maxLength={25}
                               spellCheck={false}
                               onChange={() => setAnyChange(true)}
                               defaultValue={collection.name}/>
                    </div>
                </div>

                <div className={'flex flex-col'}>
                    <label htmlFor="description" className={'mt-2'}>Description</label>
                    <div className={'flex items-end gap-2'}>
                        <textarea className={'border p-1 px-3 mt-2 border-black rounded-lg flex-grow min-h-9'}
                                  id="name"
                                  name="description"
                                  spellCheck={'false'}
                                  onChange={() => setAnyChange(true)}
                                  defaultValue={collection.description}/>
                    </div>
                </div>


                <div className={'mt-5'}>
                    <div className={'text-2xl font-bold'}>
                        Danger Zone
                    </div>

                    <div className={'flex flex-col gap-4 p-8 border-2 border-red-600 rounded-lg mt-5'}>

                        <div className={'flex flex-col'}>
                            <label htmlFor="visitbility" className={'mt-2 font-bold'}>Visibility</label>
                            <RadioGroup
                                value={isPublic}
                                onChange={(e) => {
                                    setIsPublic(e.target.value);
                                    setAnyChange(true);
                                }}
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

                        <div className={'flex flex-col'}>
                            <label htmlFor="delete" className={'mt-2 font-bold'}>Delete Collection</label>
                            <AlertDialog.Root>
                                <AlertDialog.Trigger asChild>
                                    <button
                                        className={'border p-1 px-3 mt-2 border-red-600 bg-red-200 text-red-600 rounded-lg'}>
                                        Delete
                                    </button>
                                </AlertDialog.Trigger>
                                <AlertDialog.Portal>
                                    <AlertDialog.Overlay className="alert-overlay"/>
                                    <AlertDialog.Content className="alert-content">
                                        <AlertDialog.Title className="alert-title">Are you sure?</AlertDialog.Title>
                                        <AlertDialog.Description className="alert-description">
                                            This action cannot be undone. This will permanently delete the collection.
                                        </AlertDialog.Description>

                                        <label htmlFor="delete"
                                               className={'mt-2'}>{`To confirm, type "${collection.name}" in the box below`}</label>
                                        <input
                                            type="text"
                                            value={inputValue}
                                            required={true}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            className="border border-red-500 rounded-lg p-2 w-full mb-2"
                                        />

                                        <div className="alert-buttons">
                                            <AlertDialog.Cancel asChild>
                                                <button className="alert-button cancel">Cancel</button>
                                            </AlertDialog.Cancel>
                                            <AlertDialog.Action asChild>
                                                <button disabled={inputValue !== collection.name}
                                                        className="alert-button confirm transition"
                                                        onClick={handleDelete}>Delete
                                                </button>
                                            </AlertDialog.Action>
                                        </div>
                                    </AlertDialog.Content>
                                </AlertDialog.Portal>
                            </AlertDialog.Root>
                        </div>

                    </div>

                </div>

                <div className={'flex justify-end mt-5'}>
                    <button
                        disabled={!anyChange}
                        className={'p-1 px-4 border disabled:border-gray-600 disabled:bg-gray-200 disabled:text-gray-600 border-green-600 bg-green-200 text-green-600 rounded-lg'}>Update
                    </button>
                </div>
            </form>
        </div>
    );
}