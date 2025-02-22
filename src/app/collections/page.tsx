'use client'

import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import {IconButton, Tooltip} from "@mui/material";
import React from "react";
import CreateCollectionDialog from "@/components/CreateCollectionDialog";

export default function CollectionsPage() {
    const [open, setOpen] = React.useState(false);

    return (
        <div>
            <div className={'flex justify-between items-center'}>
                <div className={'text-2xl mt-4'}>
                    Collections
                </div>

                <div>
                    <div>
                        <CreateCollectionDialog open={open} onClose={() => setOpen(false)}/>
                    </div>
                </div>

                <div>
                    <Tooltip title={'Add CollectionItem'} arrow>
                        <IconButton onClick={() => setOpen(true)}>
                            <PlaylistAddIcon/>
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
}