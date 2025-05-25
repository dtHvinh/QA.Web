import { AttachFile, Close, EmojiEmotionsOutlined, Send } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { EmojiClickData } from 'emoji-picker-react';
import { FormEvent, useEffect, useRef, useState } from 'react';
import EmojiPickerDialog from '../Common/EmojiPickerDialog';

interface ChatInputProps {
    onSubmit: (message: string, files: File[]) => void;
    onStartTyping?: () => void;
    onStopTyping?: () => void;
}

export default function ChatInput({ onSubmit, onStartTyping, onStopTyping }: ChatInputProps) {
    const [message, setMessage] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleEmojiButtonClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleEmojiClick = (emoji: EmojiClickData) => {
        setMessage(prev => prev + emoji.emoji);
        setAnchorEl(null);
    };

    useEffect(() => {
        if (!message.trim() && files.length === 0) {
            onStopTyping?.();
        }
        else {
            onStartTyping?.();
        }
    }, [message, files])

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!message.trim() && files.length === 0) return;

        onSubmit(message, files);
        setMessage('');
        setFiles([]);
        setPreviewUrls([]);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        setFiles([...files, ...selectedFiles]);

        selectedFiles.forEach(file => {
            if (file.type.startsWith('image/')) {
                const url = URL.createObjectURL(file);
                setPreviewUrls(prev => [...prev, url]);
            }
        });
    };

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
        if (previewUrls[index]) {
            URL.revokeObjectURL(previewUrls[index]);
            setPreviewUrls(prev => prev.filter((_, i) => i !== index));
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="border-t border-[var(--border-color)] p-2 bg-[var(--background)] shadow-lg">
                {(files.length > 0 || previewUrls.length > 0) && (
                    <div className="flex gap-2 mb-2 overflow-x-auto p-2">
                        {files.map((file, index) => (
                            <div key={index} className="relative group">
                                {file.type.startsWith('image/') ? (
                                    <div className="w-20 h-20 rounded-lg overflow-hidden">
                                        <img
                                            src={previewUrls[index]}
                                            alt={file.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-20 h-20 rounded-lg bg-[var(--hover-background)] flex flex-col items-center justify-center p-2">
                                        <AttachFile className="text-[var(--text-secondary)]" />
                                        <span className="text-xs text-[var(--text-secondary)] truncate w-full text-center">
                                            {file.name}
                                        </span>
                                    </div>
                                )}
                                <button
                                    type="button"
                                    onClick={() => removeFile(index)}
                                    className="absolute -top-2 -right-2 bg-[var(--error)] text-white rounded-full p-1
                                    opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Close sx={{ fontSize: 16 }} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="relative flex items-center gap-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="w-full px-5 py-2 rounded-2xl border border-[var(--border-color)] 
                        bg-[var(--hover-background)] text-[var(--text-primary)] 
                        placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 
                        focus:ring-[var(--primary-light)] focus:border-transparent
                        pr-12 transition-all text-[15px] mr-2"
                    />
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        multiple
                        className="hidden"
                        accept="image/*,.pdf,.doc,.docx,.txt"
                    />
                    {/*TODO: Implement this*/}
                    {/* <IconButton
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute right-2 p-2 bg-[var(--primary)] hover:bg-[var(--primary-darker)]
                        disabled:bg-[var(--disabled-background)] disabled:text-[var(--text-tertiary)]
                        transition-all rounded-xl shadow-md"
                        size="medium"
                    >
                        <AttachFile className="text-[var(--text-primary)]" />
                    </IconButton> */}
                    <IconButton
                        className="absolute right-2 p-2 bg-[var(--primary)] hover:bg-[var(--primary-darker)]
                        disabled:bg-[var(--disabled-background)] disabled:text-[var(--text-tertiary)]
                        transition-all rounded-xl shadow-md"
                        size="medium"
                        onClick={handleEmojiButtonClick}
                    >
                        <EmojiEmotionsOutlined className="text-[var(--text-primary)]" />
                    </IconButton>
                    <IconButton
                        type="submit"
                        disabled={!message.trim() && files.length === 0}
                        className="absolute right-2 p-2 bg-[var(--primary)] hover:bg-[var(--primary-darker)]
                        disabled:bg-[var(--disabled-background)] disabled:text-[var(--text-tertiary)]
                        transition-all rounded-xl shadow-md"
                        size="medium"
                    >
                        <Send className="text-[var(--text-primary)]" />
                    </IconButton>
                </div>
            </form>

            <EmojiPickerDialog
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                onEmojiClick={handleEmojiClick} />
        </>
    );
}