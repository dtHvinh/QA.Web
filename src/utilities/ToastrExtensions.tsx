import { toast } from 'sonner';

export default function notifyError(message: string, duration: number = 2) {
    toast.error(message, {

        duration: duration * 1000
    });
}

export function notifyWarning(message: string, duration: number = 1) {
    toast.warning(message, {

        duration: duration * 1000
    });
}

export function notifySucceed(message: string, duration: number = 1) {
    toast.success(message, {

        duration: duration * 1000
    });
}

export function notifyInfo(message: string, duration: number = 2) {
    toast.info(message, {

        duration: duration * 1000
    });
}

export function notifyConfirm(message: string, yesFn: () => void, duration: number = 2) {
    return toast(message, {

        duration: duration * 1000,
        action: {
            label: 'Yes',
            onClick: yesFn
        },
        cancel: {
            label: 'No',
            onClick: () => { }
        }
    });
}