import { CommunityDetailResponse } from "@/app/community/[name]/page";
import getAuth from "@/helpers/auth-utils";
import { deleteFetcher, formPutFetcher, IsErrorResponse } from "@/helpers/request-utils";
import { ErrorResponse } from "@/props/ErrorResponse";
import { backendURL } from "@/utilities/Constants";
import notifyError, { notifySucceed } from "@/utilities/ToastrExtensions";
import { AddPhotoAlternate, Delete, Save } from "@mui/icons-material";
import {
    Avatar,
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Tab,
    Tabs,
    TextField,
    Typography
} from "@mui/material";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

interface CommunitySettingsProps {
    open: boolean;
    onClose: () => void;
    community: CommunityDetailResponse;
    onUpdate: (updatedCommunity: Partial<CommunityDetailResponse>) => void;
}

export default function CommunitySettings({ open, onClose, community, onUpdate }: CommunitySettingsProps) {
    const [tabValue, setTabValue] = useState(0);
    const [isPrivate, setIsPrivate] = useState(community.isPrivate);
    const [name, setName] = useState(community.name);
    const [description, setDescription] = useState(community.description || '');
    const [iconImage, setIconImage] = useState<File | null>(null);
    const [iconPreview, setIconPreview] = useState(community.iconImage || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const auth = getAuth();
    const router = useRouter();

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
            <DialogTitle className="border-b border-[var(--border-color)]">
                Community Settings
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
                                src={iconPreview}
                                sx={{ width: 100, height: 100, mb: 2 }}
                            >
                                {community.name.charAt(0).toUpperCase()}
                            </Avatar>

                            <Button
                                component="label"
                                variant="outlined"
                                startIcon={<AddPhotoAlternate />}
                                className="text-[var(--text-secondary)] border-[var(--border-color)]"
                            >
                                Change Icon
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </Button>
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
                            <Button
                                onClick={onClose}
                                className="mr-2 text-[var(--text-secondary)]"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={<Save />}
                                disabled={isSubmitting}
                                className="bg-[var(--primary)] hover:bg-[var(--primary-darker)]"
                            >
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </Box>
                )}

                {tabValue === 1 && (
                    <Box className="p-6">
                        <Typography variant="h6" className="mb-4">
                            Member Management
                        </Typography>
                        <Typography variant="body2" className="text-[var(--text-secondary)]">
                            Member management features will be implemented in a future update.
                        </Typography>
                    </Box>
                )}

                {tabValue === 2 && (
                    <Box className="p-6">
                        <div className="p-4 border border-[var(--error)] rounded-lg bg-[var(--error-light)] mb-4">
                            <Typography variant="h6" className="text-[var(--error)] mb-2">
                                Delete Community
                            </Typography>
                            <Typography variant="body2" className="text-[var(--text-secondary)] mb-4">
                                Once you delete a community, there is no going back. Please be certain.
                            </Typography>
                            <Button
                                variant="contained"
                                color="error"
                                startIcon={<Delete />}
                                onClick={handleDelete}
                                className="bg-[var(--error)] hover:bg-[var(--error-darker)]"
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