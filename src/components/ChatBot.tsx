import { AutoAwesome, Lightbulb, LightbulbSharp } from "@mui/icons-material";
import React, { useEffect, useRef, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Checkbox, Dialog, DialogContent, IconButton, useTheme } from "@mui/material";
import { useStreamingChat } from "@/helpers/streaming-chat-bot-hook";
import { backendURL } from "@/utilities/Constants";
import ChatMessage from "./ChatBot/ChatMessage";
import { useEditor } from "@tiptap/react";
import { LightTooltip } from "./LightToolTip";

export default function ChatBot({ className }: { className?: string }) {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [isReasoning, setIsReasoning] = useState<boolean>(false);
    const {
        messages,
        currentMessage,
        thinking,
        handleAbort,
        handleSendMessage,
        isProcessing
    } = useStreamingChat(`${backendURL}/api/ai/chat?isReasoning=${isReasoning}`, [
        { content: "Hello im your assistant, how can I help you?", role: "assistant" }]);
    const [message, setMessage] = useState<string>('');
    const bottomChatRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const open = Boolean(anchorEl);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        handleSendMessage(message);
        if (inputRef.current)
            inputRef.current.value = ''
    };

    useEffect(() => {
        if (bottomChatRef.current)
            bottomChatRef.current.scrollIntoView({ behavior: "smooth" });
    }, [currentMessage])

    return (
        <div>
            <button
                onClick={handleClick}
                className={className}>
                <AutoAwesome />
                <div>Chat bot</div>
            </button>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                hideBackdrop={true}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent className="min-h-96 bg-white shadow-lg rounded-lg p-4">

                    <div className="pr-4 h-[474px] min-w-[100%] table">
                        {messages.map((message, index) => (
                            <ChatMessage thought={message.thought} key={index} role={message.role} content={message.content} thoughtInSeconds={message.thoughtInSeconds} />
                        ))}

                        {(currentMessage || thinking) &&
                            <ChatMessage thought={thinking} content={currentMessage} role={"assistant"} />}
                        <div ref={bottomChatRef}></div>
                    </div>

                    <div className="flex items-center pt-0">
                        <form className="flex items-center justify-center w-full space-x-2" onSubmit={handleSubmit}>
                            <input
                                ref={inputRef}
                                onChange={(e) => setMessage(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-[#e5e7eb] px-3 py-2 text-sm placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] disabled:cursor-not-allowed disabled:opacity-50 text-[#030712] focus-visible:ring-offset-2"
                                placeholder="Type your message" />
                            <LightTooltip title='Thinking before response' >
                                <Checkbox icon={<Lightbulb />} checkedIcon={<Lightbulb />} checked={isReasoning} onChange={() => setIsReasoning(!isReasoning)} />
                            </LightTooltip>

                            <button
                                type="submit"
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium text-[#f9fafb] disabled:pointer-events-none disabled:opacity-50 bg-black hover:bg-[#111827E6] h-10 px-4 py-2">
                                Send</button>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}