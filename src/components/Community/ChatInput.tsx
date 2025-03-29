import { AttachFile, Close, Image, Send } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { FormEvent, useRef, useState } from 'react';

interface ChatInputProps {
    onSubmit: (message: string, files: File[]) => void;
}

export default function ChatInput({ onSubmit }: ChatInputProps) {
    const [message, setMessage] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
                        pr-12 transition-all text-[15px]"
                />
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    multiple
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx,.txt"
                />
                <IconButton
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute right-14 text-[var(--text-secondary)] 
                        hover:text-[var(--text-primary)] transition-colors"
                    size="small"
                >
                    <Image />
                </IconButton>
                <IconButton
                    type="submit"
                    disabled={!message.trim() && files.length === 0}
                    className="absolute right-2 p-2 bg-[var(--primary)] hover:bg-[var(--primary-darker)]
                        disabled:bg-[var(--disabled-background)] disabled:text-[var(--text-tertiary)]
                        transition-all rounded-xl shadow-md"
                    size="medium"
                >
                    <Send className="text-white" />
                </IconButton>
            </div>
        </form>
    );
}