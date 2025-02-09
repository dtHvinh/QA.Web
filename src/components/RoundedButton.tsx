import {Tooltip} from "@mui/material";
import React, {ReactElement} from "react";
import Link from "next/link";

export default function RoundedButton({title, svg, onClick, className, href}: {
    title: string,
    svg: ReactElement,
    onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined,
    className?: string,
    href?: string
}) {
    return (
        <Tooltip placement={'top'} title={title}>
            {href ?
                <Link href={href}
                      className={`block transition-all p-4 bg-gray-100 active:bg-gray-400 active:scale-95 hover:bg-gray-300 rounded-full ${className}`}>
                    {svg}
                </Link>
                : <button
                    onClick={onClick}
                    className={`transition-all p-4 bg-gray-100 active:bg-gray-400 active:scale-95 hover:bg-gray-300 rounded-full ${className}`}>
                    {svg}
                </button>
            }
        </Tooltip>
    )
}