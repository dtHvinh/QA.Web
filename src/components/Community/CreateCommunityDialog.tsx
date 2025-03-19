import getAuth from '@/helpers/auth-utils';
import { formPostFetcher, IsErrorResponse } from '@/helpers/request-utils';
import { GetCommunityResponse } from '@/types/types';
import notifyError, { notifySucceed } from '@/utilities/ToastrExtensions';
import { AddPhotoAlternate, Close } from '@mui/icons-material';
import {
    Avatar,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    IconButton,
    TextField,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { FormEvent, useState } from 'react';

interface CreateCommunityDialogProps {
    open: boolean;
    onClose: () => void;
    onCreated: (community: GetCommunityResponse) => void;
}

export default function CreateCommunityDialog({ open, onClose, onCreated }: CreateCommunityDialogProps) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [iconImage, setIconImage] = useState<File | null>(null);
    const [iconPreview, setIconPreview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [nameError, setNameError] = useState('');
    const auth = getAuth();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setIconImage(file);
            setIconPreview(URL.createObjectURL(file));
        }
    };

    const validateName = (value: string) => {
        if (!value.trim()) {
            setNameError('Community name is required');
            return false;
        }

        if (value.length < 3) {
            setNameError('Community name must be at least 3 characters');
            return false;
        }

        if (value.length > 30) {
            setNameError('Community name must be less than 30 characters');
            return false;
        }

        if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
            setNameError('Community name can only contain letters, numbers, underscores, and hyphens');
            return false;
        }

        setNameError('');
        return true;
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setName(value);
        validateName(value);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateName(name)) {
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('isPrivate', isPrivate.toString());

            if (iconImage) {
                formData.append('iconImage', iconImage);
            }

            const response = await formPostFetcher([
                `/api/community`,
                auth!.accessToken,
                formData
            ]);

            if (!IsErrorResponse(response)) {
                notifySucceed("Community created successfully");
                onCreated(response);
                handleClose();
            }
        } catch (error) {
            notifyError("An error occurred while creating the community");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setName('');
        setDescription('');
        setIsPrivate(false);
        setIconImage(null);
        setIconPreview('');
        setNameError('');
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
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
                <span className="text-xl font-semibold">Create New Community</span>
                <IconButton onClick={handleClose} size="small" className="text-[var(--text-secondary)]">
                    <Close fontSize="small" />
                </IconButton>
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent className="pt-4">
                    <div className="flex flex-col items-center mb-6">
                        <Avatar
                            src={iconPreview}
                            sx={{
                                width: 100,
                                height: 100,
                                mb: 2,
                                bgcolor: 'var(--primary-light)',
                                color: 'var(--primary)'
                            }}
                        >
                            {name ? name.charAt(0).toUpperCase() : <AddPhotoAlternate />}
                        </Avatar>

                        <Button
                            component="label"
                            variant="outlined"
                            startIcon={<AddPhotoAlternate />}
                            className="text-[var(--text-secondary)] border-[var(--border-color)]"
                        >
                            Upload Icon
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </Button>
                    </div>

                    <TextField
                        autoFocus
                        label="Community Name"
                        fullWidth
                        value={name}
                        onChange={handleNameChange}
                        required
                        variant="outlined"
                        margin="normal"
                        error={!!nameError}
                        helperText={nameError || "Use only letters, numbers, underscores, and hyphens"}
                        slotProps={{
                            htmlInput: {
                                sx: {
                                    backgroundColor: 'var(--input-background)',
                                    color: 'var(--text-primary)'
                                }
                            },
                            formHelperText: {
                                sx: {
                                    color: 'var(--text-tertiary)'
                                }
                            },
                            inputLabel: {
                                sx: {
                                    color: 'var(--text-secondary)'
                                }
                            }
                        }}
                    />

                    <TextField
                        label="Description (Optional)"
                        fullWidth
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        variant="outlined"
                        margin="normal"
                        multiline
                        rows={3}
                        slotProps={{
                            htmlInput: {
                                spellCheck: false,
                            },
                            input: {
                                sx: {
                                    backgroundColor: 'var(--input-background)',
                                    color: 'var(--text-primary)'
                                }
                            },
                            inputLabel: {
                                sx: {
                                    color: 'var(--text-secondary)'
                                }
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
                </DialogContent>

                <DialogActions className="p-4 pt-2">
                    <Button
                        onClick={handleClose}
                        className="text-[var(--text-secondary)] hover:bg-[var(--hover-background)]"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={!name.trim() || !!nameError || isSubmitting}
                        className="bg-[var(--primary)] hover:bg-[var(--primary-darker)]"
                    >
                        {isSubmitting ? 'Creating...' : 'Create Community'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
