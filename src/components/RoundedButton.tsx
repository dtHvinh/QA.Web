import {Tooltip} from "@mui/material";
import React, {ReactElement} from "react";

export default function RoundedButton({title, svg, onClick}: {
    title: string,
    svg: ReactElement,
    onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined
}) {
    return (
        <Tooltip placement={'top'} title={title}>
            <button
                onClick={onClick}
                className={'p-4 bg-gray-200 active:bg-gray-400 active:scale-95 hover:bg-gray-300 rounded-full'}>
                {svg}
            </button>
        </Tooltip>
    )
}