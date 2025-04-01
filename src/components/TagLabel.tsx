import TagTooltip from "@/components/TagTooltip";
import { getFetcher } from "@/helpers/request-utils";
import { TextResponse } from "@/types/types";
import { Chip } from "@mui/material";

interface TagLabelProps {
    tagId?: string,
    name: string,
    description: string,
    className?: string,
    onClick?: (name: string) => void,
}

export default function TagLabel(params: Readonly<TagLabelProps>) {
    const { name, className, description, onClick, tagId } = params;
    const fetchTagDescription = async () => {
        return ((await getFetcher(`/api/tag/${tagId}/description`)) as TextResponse).message;
    }
    return (
        <TagTooltip name={name} description={description} fetchDescription={fetchTagDescription}>
            <Chip
                label={name}
                size="small"
                onClick={() => onClick?.(name)}
                className={`${className} bg-[var(--tag-background)] text-[var(--tag-text)] hover:bg-[var(--tag-background)] hover:opacity-80 transition-opacity`}
                sx={{
                    height: '24px',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    '& .MuiChip-label': {
                        fontSize: '0.7rem',
                        padding: '0 8px',
                    },
                }}
            />
        </TagTooltip>
    );
}