import { IsErrorResponse } from "@/helpers/request-utils";
import { isAllowedTo } from "@/helpers/requests";
import { useRouter } from "next/navigation";
import { useState } from "react";
import WarningTooltip from "./Tooltip/WarningTooltip";

export interface PermissionActionProps {
    action: string;
    children: React.ReactNode;
    className?: string;
    allowedHref?: string;
    callback?: () => void;
}

const PermissionAction = ({ children, className, action, allowedHref, callback }: Readonly<PermissionActionProps>) => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');

    const _callBack = allowedHref ? () => router.push(allowedHref) :
        callback ? callback : undefined;

    const handleClick = async () => {
        const res = await isAllowedTo(action);

        if (!IsErrorResponse(res)) {
            if (!res.isAllowed) {
                setMessage(`You need atleast ${res.reputationReq} reputation to perform this action`)
                setIsOpen(true);
            }
            else
                _callBack?.();
        }
    }

    const handleMouseLeaveButton = () => {
        setTimeout(() => setIsOpen(false), 1000);
    }

    return (
        <WarningTooltip open={isOpen} title={message} placement="right-end" arrow>
            <button onMouseLeave={handleMouseLeaveButton} className={className} onClick={handleClick}>{children}</button>
        </WarningTooltip>
    );
}

export default PermissionAction;