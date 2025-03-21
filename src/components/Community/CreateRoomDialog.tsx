import { IsErrorResponse, postFetcher } from '@/helpers/request-utils';
import notifyError, { notifySucceed } from '@/utilities/ToastrExtensions';
import { Close } from '@mui/icons-material';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { FormEvent, useState } from 'react';

interface CreateRoomDialogProps {
    open: boolean;
    communityId: number;
    onClose: () => void;
    onCreated: (roomId: number, roomName: string) => void;
}

export default function CreateRoomDialog({ open, communityId, onClose, onCreated }: CreateRoomDialogProps) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsSubmitting(true);

        try {
            const response = await postFetcher(
                `/api/community/room`,
                JSON.stringify({
                    communityId: communityId,
                    name: name
                }));

            if (!IsErrorResponse(response)) {
                notifySucceed("Room created successfully");
                onCreated(response.id, name);
                onClose();
                setName('');
            }
        } catch (error) {
            notifyError("An error occurred while creating the room");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullScreen={fullScreen}
            maxWidth="sm"
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: '12px',
                        backgroundColor: 'var(--card-background)',
                        color: 'var(--text-primary)'
                    }
                }
            }}
        >
            <DialogTitle className="flex justify-between items-center border-b border-[var(--border-color)] pb-3">
                <span className="text-xl font-semibold">Create New Room</span>
                <IconButton onClick={onClose} size="small" className="text-[var(--text-secondary)]">
                    <Close fontSize="small" />
                </IconButton>
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent className="pt-4">
                    <p className="text-[var(--text-secondary)] mb-4">
                        Create a new room for members to chat in this community.
                    </p>

                    <TextField
                        autoFocus
                        label="Room Name"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        variant="outlined"
                        margin="normal"
                        InputProps={{
                            sx: {
                                backgroundColor: 'var(--input-background)',
                                color: 'var(--text-primary)'
                            }
                        }}
                        InputLabelProps={{
                            sx: {
                                color: 'var(--text-secondary)'
                            }
                        }}
                        placeholder="General, Announcements, Help, etc."
                    />
                </DialogContent>

                <DialogActions className="p-4 pt-2">
                    <Button
                        onClick={onClose}
                        className="text-[var(--text-secondary)] hover:bg-[var(--hover-background)]"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={!name.trim() || isSubmitting}
                        className="bg-[var(--primary)] hover:bg-[var(--primary-darker)]"
                    >
                        {isSubmitting ? 'Creating...' : 'Create Room'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}