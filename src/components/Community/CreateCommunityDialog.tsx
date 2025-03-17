import getAuth from '@/helpers/auth-utils';
import { formPostFetcher, IsErrorResponse } from '@/helpers/request-utils';
import { AddPhotoAlternate, People } from '@mui/icons-material';
import {
    Avatar,
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Paper,
    TextField,
    Typography
} from '@mui/material';
import { useState } from 'react';

interface CreateCommunityDialogProps {
    open: boolean;
    onClose: () => void;
    onCreate: (name: string) => void;
}

export default function CreateCommunityDialog({ open, onClose, onCreate }: CreateCommunityDialogProps) {
    const auth = getAuth();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [stage, setStage] = useState(1);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('isPrivate', isPrivate.toString());
        if (imageFile) {
            formData.append('iconImage', imageFile);
        }

        const res = await formPostFetcher(
            [`/api/community`, auth!.accessToken, formData])

        if (!IsErrorResponse(res))
            onCreate(name);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: '12px',
                        backgroundColor: 'var(--card-background)',
                        border: '1px solid var(--border-color)'
                    }
                }
            }}
        >
            <DialogTitle sx={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                display: 'flex',
                justifyContent: 'space-between',
                pb: 1
            }}>
                Create a Community

                <FormControlLabel control={<Checkbox defaultChecked />} label="Private"
                    onChange={() => setIsPrivate(!isPrivate)} />
            </DialogTitle>
            <DialogContent>
                <div className="flex flex-col md:flex-row gap-8 mt-4">
                    <div className="flex-1">
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="community-icon"
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                />
                                <label htmlFor="community-icon">
                                    <Box
                                        sx={{
                                            width: 128,
                                            height: 128,
                                            borderRadius: '50%',
                                            border: '2px dashed var(--border-color)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            overflow: 'hidden',
                                            '&:hover': {
                                                borderColor: 'var(--primary)',
                                            },
                                            ...(imagePreview && {
                                                border: 'none',
                                            })
                                        }}
                                    >
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="Community icon"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <AddPhotoAlternate
                                                sx={{
                                                    fontSize: 48,
                                                    color: 'var(--text-tertiary)'
                                                }}
                                            />
                                        )}
                                    </Box>
                                </label>
                                <Typography
                                    variant="caption"
                                    sx={{ color: 'var(--text-tertiary)' }}
                                >
                                    Click to upload community icon
                                </Typography>
                            </Box>

                            <TextField
                                label="Community Name"
                                value={name}
                                onChange={(e) => setName(e.target.value.replaceAll(' ', '-'))}
                                fullWidth
                                helperText="Community names cannot be changed after creation"
                                placeholder="programming"
                                sx={{
                                    '& .MuiInputBase-root': {
                                        color: 'var(--text-primary)',
                                        backgroundColor: 'var(--input-background)',
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'var(--text-secondary)',
                                    },
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'var(--border-color)',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'var(--primary)',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'var(--primary)',
                                        }
                                    },
                                    '& .MuiFormHelperText-root': {
                                        color: 'var(--text-tertiary)',
                                    }
                                }}
                            />
                            <TextField
                                label="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                multiline
                                rows={4}
                                fullWidth
                                slotProps={{
                                    htmlInput: {
                                        spellCheck: false
                                    }
                                }}
                                helperText="Describe your community's purpose"
                                placeholder="Community description"
                                sx={{
                                    '& .MuiInputBase-root': {
                                        color: 'var(--text-primary)',
                                        backgroundColor: 'var(--input-background)',
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'var(--text-secondary)',
                                    },
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'var(--border-color)',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'var(--primary)',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'var(--primary)',
                                        }
                                    },
                                    '& .MuiFormHelperText-root': {
                                        color: 'var(--text-tertiary)',
                                    }
                                }}
                            />
                        </Box>
                    </div>

                    <div className="w-full md:w-2/5">
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 2,
                                bgcolor: 'var(--card-background)',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                                borderRadius: '0.75rem',
                                borderColor: 'var(--border-color)'
                            }}
                        >
                            <Typography
                                variant="subtitle2"
                                sx={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}
                            >
                                PREVIEW
                            </Typography>

                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar
                                        src={imagePreview || "/default.png"}
                                        sx={{
                                            width: 48,
                                            height: 48,
                                            bgcolor: 'var(--hover-background)'
                                        }}
                                    >
                                        {!imagePreview && name.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <div>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                wordBreak: 'break-word',
                                                color: 'var(--text-primary)',
                                                fontWeight: 600
                                            }}
                                        >
                                            qa/{name || 'community-name'}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <People sx={{ fontSize: 20, color: 'var(--text-tertiary)' }} />
                                            <Typography variant="body2" sx={{ color: 'var(--text-tertiary)' }}>
                                                1 member • 1 online
                                            </Typography>
                                        </Box>
                                    </div>
                                </Box>
                            </Box>

                            <Typography
                                variant="body2"
                                sx={{
                                    mt: 'auto',
                                    color: 'var(--text-secondary)',
                                    overflowWrap: 'break-word',
                                    whiteSpace: 'pre-wrap',
                                    overflow: 'hidden',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 4,
                                    WebkitBoxOrient: 'vertical',
                                    maxHeight: '80px'
                                }}
                            >
                                {description || 'Community description will appear here'}
                            </Typography>
                        </Paper>
                    </div>
                </div>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                {stage == 1 && (<><Button
                    onClick={onClose}
                    sx={{
                        color: 'var(--text-secondary)',
                        '&:hover': {
                            bgcolor: 'var(--hover-background)'
                        }
                    }}
                >
                    Cancel
                </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={!name.trim() || !description.trim()}
                        sx={{
                            bgcolor: 'var(--primary)',
                            '&:hover': {
                                bgcolor: 'var(--primary-darker)'
                            },
                            '&:disabled': {
                                bgcolor: 'var(--disabled-background)'
                            }
                        }}
                    >
                        Create Community
                    </Button>
                </>)}
            </DialogActions>
        </Dialog>
    );
}
