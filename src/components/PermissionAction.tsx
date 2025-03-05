import { isAllowedTo } from "@/helpers/requests";
import { useRouter } from "next/navigation";

export interface PermissionActionProps {
    action: string;
    children: React.ReactNode;
    className?: string;
    allowedHref?: string;
    callback?: () => void;
}

const PermissionAction = ({ children, className, action, allowedHref, callback }: Readonly<PermissionActionProps>) => {
    const router = useRouter();

    const _callBack = allowedHref ? () => router.push(allowedHref) :
        callback ? callback : undefined;

    return (
        <button className={className} onClick={() => isAllowedTo(action, _callBack)}>{children}</button>
    );
}

export default PermissionAction;