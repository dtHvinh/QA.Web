import {Tooltip} from "@mui/material";
import React from "react";

export default function SolvedLabel() {
    return (
        <div>
            <Tooltip arrow title={'This question has been solved'}>
                <div className={'bg-green-500 text-white px-2'}>
                    Solved
                </div>
            </Tooltip>
        </div>
    );
}