import { Menu } from '@mui/material';
import Picker, { EmojiClickData, Theme } from 'emoji-picker-react';


interface EmojiPickerDialogProps {
    open: boolean;
    anchorEl: HTMLElement | null;
    onClose: () => void;
    onEmojiClick: (emoji: EmojiClickData) => void;
}

export default function EmojiPickerDialog({ open, anchorEl, onClose, onEmojiClick }: EmojiPickerDialogProps) {
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
                        '& .MuiList-root': {
                            padding: 0,
                        }
                    }
                }
            }}
        >
            <Picker
                lazyLoadEmojis={true}
                width={320}
                height={400}
                skinTonesDisabled
                theme={document.documentElement.getAttribute('data-theme') === 'dark' ? Theme.DARK : Theme.LIGHT}
                onEmojiClick={onEmojiClick}
            />
        </Menu>
    );
}