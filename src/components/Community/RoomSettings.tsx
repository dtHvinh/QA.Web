import { ChatRoomResponse } from "@/app/community/[name]/page";
import getAuth from "@/helpers/auth-utils";
import { IsErrorResponse, putFetcher } from "@/helpers/request-utils";
import { Delete } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";

interface RoomSettingsProps {
    open: boolean;
    onClose: () => void;
    room: ChatRoomResponse | null;
    communityId: number;
    onUpdate: (updatedRoom: ChatRoomResponse) => void;
    onDelete?: (roomId: number) => void;
}

export default function RoomSettings({ open, onClose, room, communityId, onUpdate, onDelete }: RoomSettingsProps) {
    const [name, setName] = useState(room?.name || '');
    const auth = getAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!room) return;

        const response = await putFetcher([
            `/api/community/room`,
            auth!.accessToken,
            JSON.stringify({
                id: room.id,
                name: name,
            })])

        if (!IsErrorResponse(response)) {
            onUpdate({ ...room, name });
            handleSettingClose();
        }
    };

    const handleSettingClose = () => {
        setName('');
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleSettingClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    backgroundColor: 'var(--card-background)',
                    color: 'var(--text-primary)',
                    borderRadius: '12px'
                }
            }}
        >
            <form onSubmit={handleSubmit}>
                <DialogTitle className="text-[var(--text-primary)]">"{room?.name}" room settings</DialogTitle>
                <DialogContent>
                    <div className="space-y-4 pt-2">
                        <label htmlFor="name">Room Name:</label>
                        <TextField
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            fullWidth
                            required
                            placeholder={room?.name}
                            className="bg-[var(--hover-background)] rounded-lg"
                            slotProps={{
                                htmlInput: {
                                    sx: {
                                        backgroundColor: 'var(--input-background)',
                                        color: 'var(--text-primary)'
                                    }
                                }
                            }}
                            InputLabelProps={{
                                sx: {
                                    color: 'var(--text-secondary)'
                                }
                            }}
                        />

                        <div className="mt-8 border border-red-200 rounded-lg p-4 bg-red-50 dark:bg-red-950 dark:border-red-900">
                            <h3 className="text-red-600 dark:text-red-400 font-semibold mb-3">Danger Zone</h3>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-red-600 dark:text-red-400 font-medium">Delete this room</p>
                                    <p className="text-xs text-red-500 dark:text-red-300 mt-1">
                                        Once deleted, all messages will be permanently removed.
                                    </p>
                                </div>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<Delete />}
                                    onClick={() => {
                                        if (room) {
                                            onDelete?.(room.id);
                                            onClose();
                                        }
                                    }}
                                    className="border-red-200 text-red-600 hover:bg-red-50 
                                        dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
                                >
                                    Delete Room
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions className="p-6 pt-2">
                    <Button onClick={onClose} className="text-[var(--text-secondary)]">
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        className="bg-[var(--primary)] hover:bg-[var(--primary-darker)]"
                    >
                        Save Changes
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}