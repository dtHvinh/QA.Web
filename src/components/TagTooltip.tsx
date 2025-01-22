import {Tooltip, tooltipClasses, TooltipProps} from "@mui/material";
import React, {ReactElement} from "react";
import {styled} from "@mui/system";

export interface TagTooltipProps {
    name: string;
    description: string;
    children: ReactElement;
}

const HtmlTooltip = styled(({className, ...props}: TooltipProps) => (
    <Tooltip {...props} classes={{popper: className}}/>
))(() => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: 'white',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        border: '1px solid #dadde9',
        padding: '16px 16px',
    },
}));

export default function TagTooltip(params: TagTooltipProps) {
    const {name, description, children} = params;

    return (
        <div>
            <HtmlTooltip title={
                <div className={'text-xs'}>
                    <div className={'font-semibold'}>{name}</div>
                    <div className={'mt-2'}>{description}</div>
                </div>
            } placement="bottom">
                {children}
            </HtmlTooltip>
        </div>
    );
}