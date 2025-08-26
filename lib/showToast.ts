import { Bounce, toast } from "react-toastify";

export const showToast = ({ type, message }: { type: string, message: string }) => {

    let options = {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
    } as any;


    switch (type) {
        case "success":
            toast.success(message, options);
            break;
        case "error":
            toast.error(message, options);
            break;
        case "warning":
            toast.warning(message, options);
            break;
        case "info":
            toast.info(message, options);
            break;
        default:
            toast(message, options);
            break;
    }
}