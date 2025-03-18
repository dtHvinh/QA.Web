import { CommunityDetailResponse } from "@/app/community/[name]/page";
import { fromImage } from "@/helpers/utils";
import { Close, Lock, People, Public } from "@mui/icons-material";
import {
    Avatar,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    Typography
} from "@mui/material";

interface CommunityInfoProps {
    open: boolean;
    onClose: () => void;
    community: CommunityDetailResponse;
}

export default function CommunityInfo({ open, onClose, community }: CommunityInfoProps) {
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
            <DialogTitle className="flex justify-between items-center">
                <span>Community Information</span>
                <IconButton onClick={onClose} size="small" className="text-[var(--text-secondary)]">
                    <Close fontSize="small" />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <div className="flex flex-col items-center mb-6">
                    <Avatar
                        src={fromImage(community.iconImage)}
                        sx={{
                            width: 100,
                            height: 100,
                            mb: 2,
                            border: '3px solid var(--primary-light)'
                        }}
                    >
                        {community.name.charAt(0).toUpperCase()}
                    </Avatar>

                    <Typography variant="h5" className="font-bold text-center">
                        {community.name}
                    </Typography>

                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center text-[var(--text-secondary)]">
                            <People fontSize="small" className="mr-1" />
                            <span>{community.memberCount} members</span>
                        </div>

                        <span className="text-[var(--text-tertiary)]">•</span>

                        <div className="flex items-center text-[var(--text-secondary)]">
                            {community.isPrivate ? (
                                <>
                                    <Lock fontSize="small" className="mr-1" />
                                    <span>Private</span>
                                </>
                            ) : (
                                <>
                                    <Public fontSize="small" className="mr-1" />
                                    <span>Public</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <Divider className="my-4 bg-[var(--border-color)]" />

                <div className="mb-6">
                    <Typography variant="subtitle1" className="font-medium mb-2">
                        About
                    </Typography>
                    <Typography variant="body2" className="text-[var(--text-secondary)]">
                        {community.description || "No description provided."}
                    </Typography>
                </div>

                <div className="mb-6">
                    <Typography variant="subtitle1" className="font-medium mb-2">
                        Chat Rooms
                    </Typography>
                    <div className="grid grid-cols-2 gap-2">
                        {community.rooms.map(room => (
                            <div
                                key={room.id}
                                className="p-3 bg-[var(--hover-background)] rounded-lg flex items-center"
                            >
                                <div className="w-8 h-8 rounded-full bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center mr-2">
                                    <span className="text-sm">#</span>
                                </div>
                                <span className="text-sm font-medium truncate">{room.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <Divider className="my-4 bg-[var(--border-color)]" />

                <div className="text-center">
                    {community.isOwner ? (
                        <Typography variant="body2" className="text-[var(--text-tertiary)]">
                            You are the owner of this community
                        </Typography>
                    ) : community.isModerator ? (
                        <Typography variant="body2" className="text-[var(--text-tertiary)]">
                            You are a moderator of this community
                        </Typography>
                    ) : (
                        <Button
                            variant="outlined"
                            color="error"
                            className="border-[var(--error)] text-[var(--error)]"
                        >
                            Leave Community
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}