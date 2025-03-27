import { Warning } from "@mui/icons-material";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useState } from "react";

interface DeleteConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemType: string;
    itemName: string;
    isDeleting?: boolean;
}

export default function DeleteConfirmDialog({
    open,
    onClose,
    onConfirm,
    itemType,
    itemName,
    isDeleting = false
}: DeleteConfirmDialogProps) {
    const [confirmText, setConfirmText] = useState('');

    const handleConfirm = (e: any) => {
        e.preventDefault();

        if (confirmText === itemName) {
            onConfirm();
            setConfirmText('');
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
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
            <DialogTitle className="flex items-center gap-2 text-[var(--error)]">
                <Warning />
                Delete {itemType}
            </DialogTitle>
            <DialogContent>
                <div className="space-y-4">
                    <p className="text-[var(--text-primary)]">
                        Are you sure you want to delete <span className="font-semibold">"{itemName}"</span>?
                        This action cannot be undone.
                    </p>
                    <div>
                        <label className="block text-sm text-[var(--text-secondary)] mb-2">
                            Type '<span className="font-mono bg-[var(--hover-background)] px-1 rounded">{itemName}</span>' to confirm:
                        </label>
                        <form onSubmit={handleConfirm}>
                            <input
                                type="text"
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                                className="w-full px-4 py-2 border border-[var(--border-color)] 
                                bg-[var(--input-background)] text-[var(--text-primary)] rounded-lg 
                                focus:ring-2 focus:ring-[var(--error)] focus:border-[var(--error)] transition-colors"
                                placeholder={`Type '${itemName}' to confirm`}
                            />
                        </form>
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-[var(--text-secondary)] 
                                hover:bg-[var(--hover-background)] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirm}
                            disabled={confirmText !== itemName || isDeleting}
                            className="px-4 py-2 rounded-lg bg-[var(--error)] text-white
                                hover:bg-[var(--error-darker)] transition-colors
                                disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}