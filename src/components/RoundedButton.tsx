import {Tooltip} from "@mui/material";
import React, {ReactElement} from "react";

export default function RoundedButton({title, svg, onClick, className}: {
    title: string,
    svg: ReactElement,
    onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined,
    className?: string
}) {
    return (
        <Tooltip placement={'top'} title={title}>
            <button
                onClick={onClick}
                className={`transition-all p-4 bg-gray-100 active:bg-gray-400 active:scale-95 hover:bg-gray-300 rounded-full ${className}`}>
                {svg}
            </button>
        </Tooltip>
    )
}