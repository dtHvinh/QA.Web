import {AutoAwesome} from "@mui/icons-material";
import React from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import {Dialog, DialogContent, useTheme} from "@mui/material";
import ChatBotPage from "@/app/chatbot/page";

export default function ChatBot() {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const open = Boolean(anchorEl);

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <button
                onClick={handleClick}
                className="text-sm block text-gray-700 hover:bg-gray-300 p-2 rounded-full transition-colors active:scale-95">
                <AutoAwesome/>
            </button>

            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                hideBackdrop={true}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    <ChatBotPage/>
                </DialogContent>
            </Dialog>
        </div>
    );
}