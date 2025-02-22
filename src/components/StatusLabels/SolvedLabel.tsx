import {Tooltip} from "@mui/material";
import React from "react";

export default function SolvedLabel() {
    return (
        <div>
            <Tooltip arrow title={'This question has been solved'}>
                <div className={'text-green-500 text-sm border rounded-full px-2 border-green-500'}>
                    Solved
                </div>
            </Tooltip>
        </div>
    );
}