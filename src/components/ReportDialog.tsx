import { IsErrorResponse, postFetcher } from "@/helpers/request-utils";
import notifyError, { notifySucceed } from "@/utilities/ToastrExtensions";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useState } from "react";

interface ReportDialogProps {
    open: boolean;
    onClose: () => void;
    targetId: number | string;
    targetType?: string;
}

export default function ReportDialog({ open, onClose, targetId, targetType = "Question" }: ReportDialogProps) {
    const [description, setDescription] = useState("");
    const [selectedType, setSelectedType] = useState(targetType);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!description.trim()) {
            notifyError("Please provide a description for the report");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await postFetcher("/api/report/question", JSON.stringify({
                targetId,
                targetType: selectedType,
                description
            }));

            if (!IsErrorResponse(response)) {
                notifySucceed("Report submitted successfully");
                handleClose();
            }
        } catch (error) {
            console.error("Error submitting report:", error);
            notifyError("Failed to submit report");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setDescription("");
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: {
                    bgcolor: 'var(--card-background)',
                    color: 'var(--text-primary)',
                }
            }}
        >
            <DialogTitle>Report Content</DialogTitle>
            <DialogContent>
                <div className="space-y-4 mt-2">
                    <FormControl fullWidth variant="outlined">
                        <InputLabel id="report-type-label" sx={{ color: 'var(--text-secondary)' }}>
                            Content Type
                        </InputLabel>
                        <Select
                            labelId="report-type-label"
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            label="Content Type"
                            disabled={!!targetType}
                            sx={{
                                bgcolor: 'var(--input-background)',
                                color: 'var(--text-primary)',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'var(--border-color)',
                                },
                            }}
                        >
                            <MenuItem value="Question">Question</MenuItem>
                            <MenuItem value="Answer">Answer</MenuItem>
                            <MenuItem value="Comment">Comment</MenuItem>
                            <MenuItem value="User">User</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        autoFocus
                        label="Description"
                        multiline
                        rows={4}
                        fullWidth
                        variant="outlined"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Please describe the issue with this content"
                        slotProps={{
                            htmlInput: {
                                spellCheck: false,
                                sx: {
                                    color: 'var(--text-primary)',
                                }
                            }
                        }}
                        InputLabelProps={{
                            sx: {
                                color: 'var(--text-secondary)',
                            }
                        }}
                        sx={{
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'var(--border-color)',
                            },
                        }}
                    />
                </div>
            </DialogContent>
            <DialogActions sx={{ padding: 2 }}>
                <Button
                    onClick={handleClose}
                    sx={{
                        color: 'var(--text-secondary)',
                        '&:hover': {
                            bgcolor: 'var(--hover-background)',
                        }
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{
                        bgcolor: 'var(--primary)',
                        '&:hover': {
                            bgcolor: 'var(--primary-darker)',
                        }
                    }}
                >
                    Submit Report
                </Button>
            </DialogActions>
        </Dialog>
    );
}