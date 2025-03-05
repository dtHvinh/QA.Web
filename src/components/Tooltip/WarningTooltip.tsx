import { styled, Tooltip, tooltipClasses, TooltipProps } from "@mui/material";

const WarningTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))({
    [`& .${tooltipClasses.tooltip}`]: {
        maxWidth: 'none',
        backgroundColor: '#FEF3C7',
        color: '#92400E',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        fontSize: '0.875rem',
        padding: '8px 12px',
        borderRadius: '4px',
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: '#FEF3C7',
    },
});

export default WarningTooltip;