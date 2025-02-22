import React from "react";
import CheckIcon from '@mui/icons-material/Check';
import {Tooltip} from "@mui/material";

export default function MarkAcceptedAnswerLabel() {
    return (
        <Tooltip title={'Accepted Answer'} arrow>
            <div className={'text-green-600 p-3 rounded-full'}>
                <CheckIcon/>
            </div>
        </Tooltip>
    );
}