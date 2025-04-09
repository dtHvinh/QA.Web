import { Menu } from '@mui/material';
import { EmojiClickData } from 'emoji-picker-react';

interface EmojiPickerDialogProps {
    open: boolean;
    anchorEl: HTMLElement | null;
    onClose: () => void;
    onEmojiClick: (emoji: EmojiClickData) => void;
}

export default function EmojiPickerDialog({ open, anchorEl, onClose, onEmojiClick }: EmojiPickerDialogProps) {
    const commonEmojis = [
        { emoji: '👍', name: 'thumbs up' },
        { emoji: '❤️', name: 'heart' },
        { emoji: '😂', name: 'joy' },
        { emoji: '🎉', name: 'party popper' },
        { emoji: '🙏', name: 'pray' },
    ];

    const handleEmojiClick = (emoji: string, emojiName: string) => {
        onEmojiClick({ emoji, names: [emojiName] } as EmojiClickData);
        onClose();
    };

    return (
        <Menu
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            slotProps={{
                paper: {
                    sx: {
                        backgroundColor: 'var(--card-background)',
                        border: '1px solid var(--border-color)',
                        boxShadow: 'var(--shadow-md)',
                        mt: 1,
                        borderRadius: '12px',
                        overflow: 'hidden'
                    }
                }
            }}
        >
            <div className="flex px-2 gap-2">
                {commonEmojis.map((item) => (
                    <button
                        key={item.name}
                        onClick={() => handleEmojiClick(item.emoji, item.name)}
                        className="w-10 h-10 flex items-center justify-center text-2xl hover:bg-[var(--hover-background)] rounded-full transition-colors"
                    >
                        {item.emoji}
                    </button>
                ))}
            </div>
        </Menu>
    );
}