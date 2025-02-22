import {enqueueSnackbar} from "notistack";

export default function notifyError(message: string, duration: number = 1) {
    enqueueSnackbar(message, {variant: 'error', autoHideDuration: duration * 1000});
}

export function notifySucceed(message: string, duration: number = 1) {
    enqueueSnackbar(message, {variant: 'success', autoHideDuration: duration * 1000});
}

export function notifyInfo(message: string, duration: number = 2) {
    enqueueSnackbar(message, {variant: 'info', autoHideDuration: duration * 1000});
}