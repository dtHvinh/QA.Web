import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import React from "react";

export default function AlertDialog({ open, onClose, onYes, title, description, yesText, noText }: {
    open: boolean,
    onClose: () => void,
    onYes?: () => void,
    title: string,
    description: string,
    yesText?: string,
    noText?: string
}) {
    const handleYes = () => {
        if (onYes) {
            onYes();
        }
        if (onClose) {
            onClose();
        }
    }

    return (
        <div>
            <Dialog
                open={open}
                onClose={onClose}
                hideBackdrop={true}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                slotProps={{
                    paper: {
                        style: {
                            minWidth: '400px'  // You can adjust this value
                        }
                    }
                }}
            >
                <DialogTitle id="alert-dialog-title">
                    {title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {description}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <button className={'text-black px-4 py-2'} onClick={onClose}>
                        {noText ? noText : "No"}
                    </button>
                    <button className={'text-red-700 px-4 py-2'} onClick={handleYes} autoFocus>
                        {yesText ? yesText : "Yes"}
                    </button>
                </DialogActions>
            </Dialog>
        </div>
    );
}