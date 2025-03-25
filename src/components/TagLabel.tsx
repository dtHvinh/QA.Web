import TagTooltip from "@/components/TagTooltip";
import { Chip } from "@mui/material";

interface TagLabelProps {
    id?: string,
    name: string,
    description: string,
    className?: string,
    onClick?: (name: string) => void,
}

export default function TagLabel(params: Readonly<TagLabelProps>) {
    const { name, className, description, onClick } = params;

    return (
        <TagTooltip name={name} description={description}>
            <Chip
                label={name}
                size="small"
                onClick={() => onClick?.(name)}
                className={`${className} bg-[var(--tag-background)] text-[var(--tag-text)] hover:bg-[var(--tag-background)] hover:opacity-80 transition-opacity`}
                sx={{
                    height: '24px',
                    '& .MuiChip-label': {
                        fontSize: '0.7rem',
                        padding: '0 8px',
                    },
                }}
            />
        </TagTooltip>
    );
}