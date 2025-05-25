import { deleteFetcher, formPutFetcher, getFetcher, getFetcherSilent, IsErrorResponse, postFetcher } from "@/helpers/request-utils";
import { copyToClipboard, fromImage } from "@/helpers/utils";
import { ErrorResponse } from "@/props/ErrorResponse";
import { theme } from "@/theme/theme";
import { CommunityDetailResponse, GetCommunityResponse, PagedResponse } from "@/types/types";
import notifyError, { notifySucceed } from "@/utilities/ToastrExtensions";
import { AddPhotoAlternate, Close, ContentPasteOutlined, Delete, Group, PersonAdd, RestartAltOutlined, Save } from "@mui/icons-material";
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
    Typography
} from "@mui/material";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import useSWR from "swr";
import useSWRMutate from "swr/mutation";
import DeleteConfirmDialog from "../Dialog/DeleteConfirmDialog";
import CommunityMemberSettings from "./CommunityMemberSettings";
import MemberLoadingSkeleton from "./MemberLoadingSkeleton";

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
    isModerator: boolean,
    isOwner: boolean
}

function CommunityMod({ children, isModerator }: Readonly<{ children: React.ReactNode, isModerator: boolean }>) {
    return (
        isModerator &&
        <div>
            {children}
        </div>
    )
}

export function CommunityOwner({ children, isOwner }: Readonly<{ children: React.ReactNode, isOwner: boolean }>) {
    return (
        isOwner ? children : null
    )
}

export default function CommunitySettings({ open, onClose, community, onUpdate }: CommunitySettingsProps) {
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
    const [deleteCommunityConfimOpen, setDeletCommunityConfimOpen] = useState(false);
    const { data: members, isLoading: isMemberLoading, mutate } = useSWR<PagedResponse<CommunityMemberResponse>>(
        `/api/community/${community.id}/members?pageIndex=1&pageSize=100`,
        getFetcher);
    const { data: communityInvitationLink, isLoading: isCommunityInvitationLinkLoading, mutate: invitationMutate } = useSWR<{
        invitationLink: string
    }>(null, getFetcherSilent);

    const { trigger: layoutJoinedList } = useSWRMutate<GetCommunityResponse[]>(`/api/community/joined?pageIndex=1&pageSize=15`, getFetcher);
    console.log(community)
    useEffect(() => {
        setAnyChange(name !== community.name
            || description !== community.description
            || isPrivate !== community.isPrivate
            || iconImage !== null)
    }, [name, description, isPrivate, iconImage]);

    const handleModeratorGranted = (memberId: string) => {
        if (members)
            mutate({
                ...members,
                items: members?.items.map(m => m.id === memberId ? {
                    ...m,
                    isModerator: true
                } : m)
            })
    }

    const handleMemDel = (memberId: string) => {
        if (members)
            mutate({
                ...members,
                items: members?.items.filter(m => m.id !== memberId)
            })
    }

    const handleModRevoked = (memberId: string) => {
        if (members)
            mutate({
                ...members,
                items: members?.items.map(m => m.id === memberId ? {
                    ...m,
                    isModerator: false
                } : m)
            })
    }

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleClose = () => {
        setIconPreview(community.iconImage || '');
        onClose();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setIconImage(file);
            setIconPreview(URL.createObjectURL(file));
        }
    };

    const handleCreateInvitationLink = async () => {
        const response = await postFetcher(`/api/community/${community.id}/invitation`);

        if (!IsErrorResponse(response)) {
            notifySucceed('Invitation link created successfully');
            copyToClipboard((response as { invitationLink: string }).invitationLink);
            invitationMutate(() => {
                return {
                    ...communityInvitationLink,
                    invitationLink: (response as { invitationLink: string }).invitationLink
                }
            })
        }
    }

    const updateCommunitySideBar = async () => {
        await layoutJoinedList(undefined, {
            populateCache: (_, data) => {
                return data!.map(e => {
                    return (Number.parseInt(e.id) === community.id)
                        ? {
                            ...e,
                            name,
                            description,
                            isPrivate,
                            iconImage: iconPreview,
                        }
                        : e
                });
            },
            revalidate: true
        });
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('id', community.id.toString());
        formData.append('name', name);
        formData.append('description', description);
        formData.append('isPrivate', isPrivate.toString());

        if (iconImage) {
            formData.append('iconImage', iconImage);
        }

        const response = await formPutFetcher(`/api/community`, formData);

        if (!IsErrorResponse(response)) {

            notifySucceed('Community updated successfully');

            onUpdate({
                name,
                description,
                isPrivate,
                iconImage: iconPreview
            });

            await updateCommunitySideBar();

            onClose();
            setIsSubmitting(false);
        }
    };

    const handleDeleteCommunity = async () => {
        try {
            const response = await deleteFetcher(`/api/community/${community.id}`);

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
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
            slotProps={{
                paper: {
                    sx: {
                        backgroundColor: 'var(--card-background)',
                        color: 'var(--text-primary)',
                        borderRadius: fullScreen ? 'none' : '12px'
                    }
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
                            },
                            textTransform: 'none',
                        },
                        '& .MuiTabs-indicator': {
                            backgroundColor: 'var(--primary)'
                        }
                    }}
                >
                    <Tab label="General" />
                    <Tab label="Members" />
                    {community.isOwner &&
                        <Tab label="Danger Zone" />
                    }
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

                            <CommunityOwner isOwner={community.isOwner}>
                                <label
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg
                                text-[var(--text-secondary)] border border-[var(--border-color)]
                                hover:bg-[var(--hover-background)] transition-colors
                                cursor-pointer"
                                >
                                    <AddPhotoAlternate fontSize="small" />
                                    Change Icon
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            </CommunityOwner>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="communityName" className="block text-sm font-medium text-[var(--text-primary)]">
                                Community Name <span className="text-[var(--error)]">*</span>
                            </label>
                            <input
                                id="communityName"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={!community.isOwner}
                                required
                                placeholder="Enter community name"
                                className="w-full px-4 py-2.5 rounded-lg border border-[var(--border-color)] 
                                bg-[var(--input-background)] text-[var(--text-primary)] 
                                placeholder:text-[var(--text-tertiary)] 
                                focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] focus:border-[var(--primary)]
                                disabled:opacity-60 disabled:cursor-not-allowed
                                transition-all"
                            />
                        </div>

                        <div className="space-y-2 mt-6">
                            <label htmlFor="description" className="block text-sm font-medium text-[var(--text-primary)]">
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={!community.isOwner}
                                placeholder="Enter community description"
                                rows={4}
                                className="w-full px-4 py-2.5 rounded-lg border border-[var(--border-color)] 
                                bg-[var(--input-background)] text-[var(--text-primary)] 
                                placeholder:text-[var(--text-tertiary)] 
                                focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] focus:border-[var(--primary)]
                                disabled:opacity-60 disabled:cursor-not-allowed resize-none
                                transition-all"
                            />
                        </div>

                        <CommunityOwner isOwner={community.isOwner}>
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
                        </CommunityOwner>
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
                            {(community.isPrivate && (community.isModerator || community.isOwner)) &&
                                (communityInvitationLink?.invitationLink ?
                                    <div className="flex items-center gap-2">
                                        <div className="relative flex items-center gap-2 px-4 py-2 rounded-lg
                                        text-[var(--text-secondary)] border border-[var(--border-color)]
                                        bg-[var(--input-background)]"
                                        >
                                            <PersonAdd fontSize="small" />
                                            <input
                                                type="text"
                                                value={communityInvitationLink?.invitationLink}
                                                className="bg-transparent border-none outline-none text-sm"
                                                readOnly
                                            />
                                            <div className="flex items-center gap-1">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => {
                                                        copyToClipboard(communityInvitationLink.invitationLink);
                                                    }}
                                                    className="text-[var(--text-primary)] hover:text-[var(--primary)]"
                                                >
                                                    <ContentPasteOutlined fontSize="small" className="text-[var(--text-primary)]" />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    onClick={handleCreateInvitationLink}
                                                    className="text-[var(--text-primary)] hover:text-[var(--primary)]"
                                                >
                                                    <RestartAltOutlined fontSize="small" className="text-[var(--text-primary)]" />
                                                </IconButton>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <button
                                        type="button"
                                        onClick={handleCreateInvitationLink}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg
                                    text-[var(--text-secondary)] border border-[var(--border-color)]
                                    hover:bg-[var(--hover-background)] transition-colors"
                                    >
                                        <PersonAdd fontSize="small" />
                                        Create Invitation Link
                                    </button>
                                )}
                        </div>

                        {isMemberLoading ? (
                            <MemberLoadingSkeleton />
                        ) : (
                            <div className="space-y-3">
                                <CommunityMemberSettings
                                    community={community}
                                    members={members?.items || []}
                                    onGrantModerator={handleModeratorGranted}
                                    onRevokeModerator={handleModRevoked}
                                    onRemoveMember={handleMemDel}
                                />
                            </div>
                        )}
                    </Box>
                )}

                {tabValue === 2 && (
                    <Box className="p-5">
                        <div className="p-4 pb-8 border border-[var(--error)] rounded-lg bg-opacity-10 mb-4 flex flex-col gap-2">
                            <Typography variant="h6" className="text-[var(--error)] mb-2">
                                Delete Community
                            </Typography>
                            <Typography variant="body2" className="text-[var(--text-secondary)] mb-5">
                                Once you delete a community, there is no going back. Please be certain.
                            </Typography>
                            <Button
                                sx={{
                                    textTransform: 'none',
                                    '&:hover': {
                                        backgroundColor: 'var(--error-darker)'
                                    }
                                }}
                                variant="contained"
                                color="error"
                                startIcon={<Delete />}
                                onClick={() => setDeletCommunityConfimOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg
                                    bg-[var(--error)] hover:bg-[var(--error-darker)]
                                    text-white transition-colors"
                            >
                                Delete Community
                            </Button>
                        </div>
                    </Box>
                )}

                <DeleteConfirmDialog
                    itemType="community"
                    itemName={community.name}
                    onClose={() => setDeletCommunityConfimOpen(false)}
                    onConfirm={handleDeleteCommunity}
                    open={deleteCommunityConfimOpen}
                />
            </DialogContent>
        </Dialog>
    );
}