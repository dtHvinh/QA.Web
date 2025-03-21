import getAuth from "@/helpers/auth-utils";
import { deleteFetcher, formPutFetcher, getFetcher, IsErrorResponse } from "@/helpers/request-utils";
import { fromImage } from "@/helpers/utils";
import { ErrorResponse } from "@/props/ErrorResponse";
import { theme } from "@/theme/theme";
import { CommunityDetailResponse, PagedResponse } from "@/types/types";
import { backendURL } from "@/utilities/Constants";
import notifyError, { notifySucceed } from "@/utilities/ToastrExtensions";
import { AddPhotoAlternate, Close, Delete, Group, PersonAdd, Save } from "@mui/icons-material";
import {
    Avatar,
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    IconButton,
    Tab,
    Tabs,
    TextField,
    Typography
} from "@mui/material";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import useSWR from "swr";

interface CommunitySettingsProps {
    open: boolean;
    onClose: () => void;
    community: CommunityDetailResponse;
    onUpdate: (updatedCommunity: Partial<CommunityDetailResponse>) => void;
}

export interface CommunityMemberResponse {
    id: string,
    username: string,
    profileImage: string,
    isModerator: boolean
}

export default function CommunitySettings({ open, onClose, community, onUpdate }: CommunitySettingsProps) {
    const auth = getAuth();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const router = useRouter();
    const [tabValue, setTabValue] = useState(0);
    const [isPrivate, setIsPrivate] = useState(community.isPrivate);
    const [name, setName] = useState(community.name);
    const [description, setDescription] = useState(community.description || '');
    const [iconImage, setIconImage] = useState<File | null>(null);
    const [iconPreview, setIconPreview] = useState(community.iconImage || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [anyChange, setAnyChange] = useState(false);
    const { data: members, isLoading: isMemberLoading } = useSWR<PagedResponse<CommunityMemberResponse>>([
        `/api/community/${community.id}/members?pageIndex=1&pageSize=100`,
        auth!.accessToken],
        getFetcher);

    useEffect(() => {
        setAnyChange(name !== community.name
            || description !== community.description
            || isPrivate !== community.isPrivate
            || iconImage !== null)
    }, [name, description, isPrivate, iconImage]);

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setIconImage(file);
            setIconPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('id', community.id.toString());
            formData.append('name', name);
            formData.append('description', description);
            formData.append('isPrivate', isPrivate.toString());

            if (iconImage) {
                formData.append('iconImage', iconImage);
            }

            const response = await formPutFetcher([
                `${backendURL}/api/community`,
                auth!.accessToken,
                formData
            ]);

            if (!IsErrorResponse(response)) {

                notifySucceed('Community updated successfully');
                onUpdate({
                    name,
                    description,
                    isPrivate,
                    iconImage: iconPreview
                });
                onClose();
            }
        } catch (error) {
            notifyError('Failed to update community');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this community? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await deleteFetcher([
                `${backendURL}/api/community/${community.id}`,
                auth!.accessToken
            ]);

            if (IsErrorResponse(response)) {
                notifyError((response as ErrorResponse).title);
                return;
            }

            notifySucceed('Community deleted successfully');
            router.push('/community');
        } catch (error) {
            notifyError('Failed to delete community');
        }
    };

    return (
        <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: {
                    backgroundColor: 'var(--card-background)',
                    color: 'var(--text-primary)',
                    borderRadius: '12px'
                }
            }}
        >
            <DialogTitle className="border-b border-[var(--border-color)] flex justify-between">
                <div>
                    Community Settings
                </div>
                <IconButton onClick={onClose}>
                    <Close className="text-[var(--text-primary)]" />
                </IconButton>
            </DialogTitle>

            <DialogContent className="p-0">
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    className="border-b border-[var(--border-color)]"
                    sx={{
                        '& .MuiTab-root': {
                            color: 'var(--text-secondary)',
                            '&.Mui-selected': {
                                color: 'var(--primary)'
                            }
                        },
                        '& .MuiTabs-indicator': {
                            backgroundColor: 'var(--primary)'
                        }
                    }}
                >
                    <Tab label="General" />
                    <Tab label="Members" />
                    <Tab label="Danger Zone" />
                </Tabs>

                {tabValue === 0 && (
                    <Box component="form" onSubmit={handleSubmit} className="p-6">
                        <div className="flex flex-col items-center mb-6">
                            <Avatar
                                src={fromImage(iconPreview)}
                                sx={{ width: 100, height: 100, mb: 2 }}
                            >
                                {community.name.charAt(0).toUpperCase()}
                            </Avatar>

                            <button
                                type="button"
                                className="flex items-center gap-2 px-4 py-2 rounded-lg
                                    text-[var(--text-secondary)] border border-[var(--border-color)]
                                    hover:bg-[var(--hover-background)] transition-colors"
                            >
                                <AddPhotoAlternate fontSize="small" />
                                Change Icon
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </button>
                        </div>

                        <TextField
                            label="Community Name"
                            fullWidth
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            margin="normal"
                            required
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
                        />

                        <TextField
                            label="Description"
                            fullWidth
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            margin="normal"
                            multiline
                            rows={4}
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
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isPrivate}
                                    onChange={(e) => setIsPrivate(e.target.checked)}
                                    sx={{
                                        color: 'var(--text-secondary)',
                                        '&.Mui-checked': {
                                            color: 'var(--primary)',
                                        },
                                    }}
                                />
                            }
                            label="Private Community"
                            className="mt-2 text-[var(--text-primary)]"
                        />

                        <Typography variant="body2" className="mt-1 text-[var(--text-tertiary)]">
                            Private communities require approval to join and are not visible in search results.
                        </Typography>

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
                                disabled={isSubmitting || !anyChange}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg
                                    bg-[var(--primary)] hover:bg-[var(--primary-darker)]
                                    text-white transition-colors disabled:opacity-50"
                            >
                                <Save fontSize="small" />
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </Box>
                )}

                {tabValue === 1 && (
                    <Box className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <Group className="text-[var(--text-secondary)]" />
                                <Typography variant="h6" className="text-[var(--text-primary)]">
                                    Members ({members?.totalCount || 0})
                                </Typography>
                            </div>
                            <button
                                type="button"
                                className="flex items-center gap-2 px-4 py-2 rounded-lg
                                    text-[var(--text-secondary)] border border-[var(--border-color)]
                                    hover:bg-[var(--hover-background)] transition-colors"
                            >
                                <PersonAdd fontSize="small" />
                                Invite Members
                            </button>
                        </div>

                        {isMemberLoading ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center gap-3 animate-pulse">
                                        <div className="w-10 h-10 rounded-full bg-[var(--hover-background)]" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 w-32 bg-[var(--hover-background)] rounded" />
                                            <div className="h-3 w-20 bg-[var(--hover-background)] rounded" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {members?.items.map((member) => (
                                    <div key={member.id}
                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--hover-background)] transition-colors">
                                        <Avatar
                                            src={fromImage(member.profileImage)}
                                            sx={{ width: 40, height: 40 }}
                                        >
                                            {member.username.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="font-medium text-[var(--text-primary)]">
                                                {member.username}
                                            </div>
                                            {member.isModerator && (
                                                <div className="text-sm text-[var(--primary)]">
                                                    Moderator
                                                </div>
                                            )}
                                        </div>
                                        {community.isOwner && (
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                sx={{ textTransform: 'none' }}
                                                className="text-[var(--text-secondary)] border-[var(--border-color)]"
                                            >
                                                {member.isModerator ? 'Remove Mod' : 'Make Mod'}
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </Box>
                )}

                {tabValue === 2 && (
                    <Box className="p-6">
                        <div className="p-4 border border-[var(--error)] rounded-lg bg-[var(--error-light)] mb-4 flex flex-col gap-2">
                            <Typography variant="h6" className="text-[var(--error)] mb-2">
                                Delete Community
                            </Typography>
                            <Typography variant="body2" className="text-[var(--text-secondary)] mb-5">
                                Once you delete a community, there is no going back. Please be certain.
                            </Typography>
                            <Button
                                sx={{ textTransform: 'none' }}
                                variant="contained"
                                color="error"
                                startIcon={<Delete />}
                                onClick={handleDelete}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg
                                    bg-[var(--error)] hover:bg-[var(--error-darker)]
                                    text-white transition-colors"
                            >
                                Delete Community
                            </Button>
                        </div>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
}