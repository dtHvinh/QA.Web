import { Dialog } from "@mui/material";

export default function GenericDialog({ open, onClose, fullScreen, children }: {
    open: boolean, onClose: () => void, fullScreen: boolean, children: React.ReactNode
}) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
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
            {children}
        </Dialog>
    )
}