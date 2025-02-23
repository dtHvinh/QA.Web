import {Checkbox, checkboxClasses, Dialog, FormControlLabel, IconButton, Tooltip} from "@mui/material";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import React from "react";
import getAuth from "@/helpers/auth-utils";
import {backendURL} from "@/utilities/Constants";
import {GetCollectionWithAddStatusResponse} from "@/types/types";
import {getFetcher, IsErrorResponse} from "@/helpers/request-utils";
import notifyError from "@/utilities/ToastrExtensions";
import {ErrorResponse} from "@/props/ErrorResponse";
import {Lock, Public} from "@mui/icons-material";
import {useSnackbar} from "notistack";
import CreateCollectionDialog from "@/components/CreateCollectionDialog";
import {addQuestionToCollection, deleteQuestionFromCollection} from "@/helpers/requests";

export default function AddToCollection({questionId}: Readonly<{ questionId: string }>) {
    const requestUrl = `${backendURL}/api/collection/with_question/${questionId}`;
    const auth = getAuth();
    const [open, setOpen] = React.useState(false);
    const [collectionWithStatus, setCollectionWithStatus] = React.useState<GetCollectionWithAddStatusResponse[]>([]);
    const {enqueueSnackbar} = useSnackbar();
    const [createCollectionDialogOpen, setCreateCollectionDialogOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    }

    const loadCollectionWithStatus = async () => {
        const res = await getFetcher([requestUrl, auth!.accessToken]);

        if (IsErrorResponse(res)) {
            notifyError((res as ErrorResponse).title);
        } else {
            setCollectionWithStatus(res as GetCollectionWithAddStatusResponse[]);
        }
    }

    const handleOpen = async () => {
        await loadCollectionWithStatus();

        setOpen(true);
    }

    const handleCheck = async (e: React.ChangeEvent<HTMLInputElement>, collectionId: string, collectionName: string) => {
        const action = e.target.checked ? 'add' : 'delete';

        const res = e.target.checked ?
            await addQuestionToCollection(questionId, collectionId) :
            await deleteQuestionFromCollection(questionId, collectionId);

        if (IsErrorResponse(res)) {
            notifyError((res as ErrorResponse).title);
        } else {
            enqueueSnackbar(
                <div>
                    {action} {action === 'add' ? 'to' : 'from'} {collectionName}
                </div>, {variant: 'success'});
        }
    }

    const handleOnCreateCollection = async () => {
        setCreateCollectionDialogOpen(false);
        await loadCollectionWithStatus();
    }

    return (
        <>
            <Tooltip title={'Add to collection'}>
                <IconButton onClick={handleOpen} sx={{width: 48, height: 48, backgroundColor: '#f3f4f6'}}>
                    <PlaylistAddIcon/>
                </IconButton>
            </Tooltip>

            <CreateCollectionDialog open={createCollectionDialogOpen}
                                    onClose={() => setCreateCollectionDialogOpen(false)}
                                    onCreated={handleOnCreateCollection}/>

            <Dialog open={open} onClose={handleClose} hideBackdrop={true} slotProps={{
                paper: {
                    elevation: 5,
                }
            }}>
                <div className={'p-5 px-9 flex flex-col'}>
                    <div className={'text-2xl'}>Add this question to...</div>

                    <div className={'flex flex-col gap-0 mt-5'}>
                        {collectionWithStatus.map((collection) => (
                            <FormControlLabel key={collection.id}
                                              className={'p-2 flex gap-2'}
                                              control={<Checkbox defaultChecked={collection.isAdded}
                                                                 onChange={(e) =>
                                                                     handleCheck(e, collection.id, collection.name)}
                                                                 sx={{
                                                                     [`&, &.${checkboxClasses.checked}`]: {
                                                                         color: 'black',
                                                                     },
                                                                 }}/>} label={
                                <div className={'flex'}>
                                    <div className={'text-sm mr-2 text-gray-500'}>
                                        {collection.isPublic ?
                                            <Public fontSize={'small'}/>
                                            :
                                            <Lock fontSize={'small'}/>}
                                    </div>
                                    <div>
                                        {collection.name}
                                    </div>
                                </div>
                            }/>
                        ))}
                    </div>

                    <button
                        onClick={() => setCreateCollectionDialogOpen(true)}
                        className={'flex mt-4 border py-1 rounded-full bg-gray-200 hover:bg-gray-300 border-gray-500 justify-center transition'}>
                        Add collection
                    </button>
                </div>
            </Dialog>
        </>
    );
}