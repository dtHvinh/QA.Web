import { enqueueSnackbar, SnackbarKey, SnackbarOrigin } from "notistack";

export default function notifyError(message: string, position?: SnackbarOrigin, duration: number = 2) {
    enqueueSnackbar(message, {
        variant: 'error',
        autoHideDuration: duration * 1000,
        anchorOrigin: position ?? { horizontal: "center", vertical: "top" }
    });
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

export function notifyConfirm(message: string, yesFn: () => void, position?: SnackbarOrigin, duration: number = 2): SnackbarKey {
    return enqueueSnackbar(
        <div className="p-3 rounded-lg shadow-sm">
            <div className="text-lg font-medium mb-3">{message}</div>
            <div className="flex justify-end gap-3 mt-5">
                <button
                    onClick={yesFn}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                >
                    Yes
                </button>
                <button
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200"
                >
                    No
                </button>
            </div>
        </div>,
        {
            variant: 'default',
            autoHideDuration: duration * 1000,
            anchorOrigin: position ?? { horizontal: "center", vertical: "top" }
        }
    );
}