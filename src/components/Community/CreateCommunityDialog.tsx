import { People } from '@mui/icons-material';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
    TextField,
    Typography
} from '@mui/material';
import { useState } from 'react';

interface CreateCommunityDialogProps {
    open: boolean;
    onClose: () => void;
    onCreate: (name: string, description: string) => void;
}

export default function CreateCommunityDialog({ open, onClose, onCreate }: CreateCommunityDialogProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = () => {
        onCreate(name, description);
        console.log(name, description)
        setName('');
        setDescription('');
        onClose();
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
                    }
                }
            }}
        >
            <DialogTitle sx={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: 'gray.900',
                pb: 1
            }}>
                Create a Community
            </DialogTitle>
            <DialogContent>
                <div className="flex flex-col md:flex-row gap-8 mt-4">
                    <div className="flex-1">
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <TextField
                                label="Community Name"
                                value={name}
                                onChange={(e) => setName(e.target.value.replaceAll(' ', '-'))}
                                fullWidth
                                helperText="Community names cannot be changed after creation"
                                placeholder="programming"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&:hover fieldset': {
                                            borderColor: 'rgb(59, 130, 246)',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'rgb(59, 130, 246)',
                                        }
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
                                helperText="Describe your community's purpose"
                                placeholder="A community for discussing programming concepts and challenges"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&:hover fieldset': {
                                            borderColor: 'rgb(59, 130, 246)',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'rgb(59, 130, 246)',
                                        }
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
                                bgcolor: 'rgb(249, 250, 251)',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                                borderRadius: '0.75rem',
                                borderColor: 'rgb(229, 231, 235)'
                            }}
                        >
                            <Typography
                                variant="subtitle2"
                                sx={{ color: 'rgb(107, 114, 128)', fontSize: '0.875rem' }}
                            >
                                PREVIEW
                            </Typography>

                            <Box>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        wordBreak: 'break-word',
                                        color: 'rgb(17, 24, 39)',
                                        fontWeight: 600
                                    }}
                                >
                                    qa/{name || 'community-name'}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                    <People sx={{ fontSize: 20, color: 'rgb(107, 114, 128)' }} />
                                    <Typography variant="body2" sx={{ color: 'rgb(107, 114, 128)' }}>
                                        1 member • 1 online
                                    </Typography>
                                </Box>
                            </Box>

                            <Typography
                                variant="body2"
                                sx={{
                                    mt: 'auto',
                                    color: 'rgb(107, 114, 128)'
                                }}
                            >
                                {description || 'Community description will appear here'}
                            </Typography>
                        </Paper>
                    </div>
                </div>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button
                    onClick={onClose}
                    sx={{
                        color: 'rgb(75, 85, 99)',
                        '&:hover': {
                            bgcolor: 'rgb(243, 244, 246)'
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
                        bgcolor: 'rgb(59, 130, 246)',
                        '&:hover': {
                            bgcolor: 'rgb(29, 78, 216)'
                        },
                        '&:disabled': {
                            bgcolor: 'rgb(229, 231, 235)'
                        }
                    }}
                >
                    Create Community
                </Button>
            </DialogActions>
        </Dialog>
    );
}