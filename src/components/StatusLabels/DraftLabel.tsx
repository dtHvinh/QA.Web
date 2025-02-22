import {Tooltip} from "@mui/material";
import React from "react";

export default function DraftLabel() {
    return (
        <div>
            <Tooltip arrow title={'This question is a draft'}>
                <div className={'text-gray-500 text-sm border rounded-full px-2 border-gray-500'}>
                    Draft
                </div>
            </Tooltip>
        </div>
    );
}