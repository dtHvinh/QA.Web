import {Flip, Slide, toast} from "react-toastify";

/**
 * Show an error notification
 * @param message The message to show
 * @param duration The duration to show the notification in seconds
 */
export default function notifyError(message: string, duration: number = 1) {
    toast['error'](message, {
        position: 'top-center',
        className: 'text-black',
        autoClose: duration * 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        closeButton: false,
        theme: 'colored',
        transition: Slide
    });
}

/**
 * Show a success notification
 * @param message The message to show
 * @param duration The duration to show the notification in seconds
 */
export function notifySucceed(message: string, duration: number = 1) {
    toast['success'](message, {
        position: "top-right",
        autoClose: duration * 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        closeButton: false,
        theme: "colored",
        transition: Slide,
    });
}

export function notifyInfo(message: string, duration: number = 2) {
    toast['info'](message, {
        position: "top-right",
        autoClose: duration * 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Flip,
    });
}