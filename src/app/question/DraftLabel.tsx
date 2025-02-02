import {Tooltip} from "@mui/material";
import React from "react";

export default function DraftLabel() {
    return (
        <div>
            <Tooltip arrow title={'This question is a draft'}>
                <div className={'bg-gray-500 text-white px-2'}>
                    Draft
                </div>
            </Tooltip>
        </div>
    );
}