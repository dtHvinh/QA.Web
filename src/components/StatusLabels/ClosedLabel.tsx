import {Tooltip} from "@mui/material";
import React from "react";

export default function ClosedLabel() {
    return (
        <div>
            <Tooltip arrow title={'This question has been closed'}>
                <div className={'text-red-500 text-sm border rounded-full px-2 border-red-500'}>
                    Closed
                </div>
            </Tooltip>
        </div>
    );
}