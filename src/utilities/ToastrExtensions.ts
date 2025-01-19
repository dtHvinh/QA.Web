import { toast } from "react-toastify";

export default function notify(type: string, message: string) {
    toast['error'](message, {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        closeButton: false,
        theme: 'colored',
    });
}