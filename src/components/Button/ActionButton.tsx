import { Tooltip } from "@mantine/core";
import { Check, Eye, Pen, Plus, Printer, Search, Trash, X } from "lucide-react";

export default function ActionButton({ kind, onClick, className }: {
    className?: string, kind: 'edit' | 'delete' | 'add' | 'check' | 'cancel' | 'search' | 'print', onClick: () => void
}) {
    const getIcon = (kind: string) => {
        switch (kind) {
            case "edit":
                return <Pen size={16} className=" text-gray-600 cursor-pointer" />;
            case "delete":
                return <Trash size={16} className=" text-gray-600 cursor-pointer" />;
            case "add":
                return <Plus size={16} className=" text-gray-600 cursor-pointer" />;
            case "check":
                return <Check size={16} className=" text-gray-600 cursor-pointer" />;
            case "cancel":
                return <X size={16} className=" text-gray-600 cursor-pointer" />;
            case 'view':
                return <Eye size={16} className=" text-gray-600 cursor-pointer" />;
            case 'search':
                return <Search size={16} className=" text-gray-600 cursor-pointer" />;
            case 'print':
                return <Printer size={16} className=" text-gray-600 cursor-pointer" />;
            default:
                return null;
        }
    }

    return (
        <Tooltip label={kind}>
            <button className={`p-2 rounded-full ${className}`} onClick={onClick}>
                {getIcon(kind)}
            </button>
        </Tooltip>
    )
}