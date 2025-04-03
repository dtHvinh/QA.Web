import { IsErrorResponse, postFetcher } from "@/helpers/request-utils";
import { ErrorResponse } from "@/props/ErrorResponse";
import { TextResponse } from "@/types/types";
import notifyError, { notifySucceed } from "@/utilities/ToastrExtensions";
import { Close } from "@mui/icons-material";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

interface JoinViaInvitationDialogProps {
    open: boolean;
    onClose: () => void;
}

export default function JoinViaInvitationDialog({ open, onClose }: JoinViaInvitationDialogProps) {
    const [invitationLink, setInvitationLink] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!invitationLink.trim()) return;

        setIsSubmitting(true);

        const response = await postFetcher(`/api/community/invited/${invitationLink}`);

        if (!IsErrorResponse(response)) {
            notifySucceed('Joined community successfully');
            router.push(`/community/${(response as TextResponse).message}`);
            onClose();
        }
        else
            notifyError((response as ErrorResponse).title);

        setIsSubmitting(false);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            slotProps={{
                paper: {
                    sx: {
                        backgroundColor: 'var(--card-background)',
                        color: 'var(--text-primary)',
                        borderRadius: '12px'
                    }
                }
            }}
        >
            <DialogTitle className="border-b border-[var(--border-color)] flex justify-between">
                <div>Join Community via Invitation</div>
                <IconButton onClick={onClose}>
                    <Close className="text-[var(--text-primary)]" />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <form onSubmit={handleSubmit} className="pt-4">
                    <div className="space-y-2">
                        <label htmlFor="invitationLink" className="block text-sm font-medium text-[var(--text-primary)]">
                            Invitation Link <span className="text-[var(--error)]">*</span>
                        </label>
                        <input
                            id="invitationLink"
                            type="text"
                            value={invitationLink}
                            onChange={(e) => setInvitationLink(e.target.value)}
                            required
                            spellCheck={false}
                            placeholder="Paste invitation link here"
                            className="w-full px-4 py-2.5 rounded-lg border border-[var(--border-color)] 
                                bg-[var(--input-background)] text-[var(--text-primary)] 
                                placeholder:text-[var(--text-tertiary)] 
                                focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] focus:border-[var(--primary)]
                                transition-all"
                        />
                    </div>

                    <div className="flex justify-end mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="mr-2 px-4 py-2 rounded-lg text-[var(--text-secondary)]
                                hover:bg-[var(--hover-background)] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !invitationLink.trim()}
                            className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white
                                hover:bg-[var(--primary-darker)] transition-colors
                                disabled:opacity-50 disabled:cursor-not-allowed
                                flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Joining...
                                </>
                            ) : (
                                'Join Community'
                            )}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}