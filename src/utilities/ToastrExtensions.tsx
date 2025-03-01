import { enqueueSnackbar, SnackbarOrigin } from "notistack";

export default function notifyError(message: string, position?: SnackbarOrigin, duration: number = 1) {
    enqueueSnackbar(message, { variant: 'error', autoHideDuration: duration * 1000, anchorOrigin: position });
}

export function notifyWarning(message: string, position?: SnackbarOrigin, duration: number = 1) {
    enqueueSnackbar(message, { variant: 'warning', autoHideDuration: duration * 1000, anchorOrigin: position });
}

export function notifySucceed(message: string, position?: SnackbarOrigin, duration: number = 1) {
    enqueueSnackbar(message, { variant: 'success', autoHideDuration: duration * 1000, anchorOrigin: position });
}

export function notifyInfo(message: string, position?: SnackbarOrigin, duration: number = 2) {
    enqueueSnackbar(message, { variant: 'info', autoHideDuration: duration * 1000, anchorOrigin: position });
}