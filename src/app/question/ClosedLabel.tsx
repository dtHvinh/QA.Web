import {Tooltip} from "@mui/material";
import React from "react";

export default function ClosedLabel() {
    return (
        <div>
            <Tooltip arrow title={'This question has been closed'}>
                <div className={'bg-red-500 text-white px-2'}>
                    Closed
                </div>
            </Tooltip>
        </div>
    );
}