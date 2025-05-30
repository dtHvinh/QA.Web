import { Tooltip, tooltipClasses, TooltipProps } from "@mui/material";
import { styled } from "@mui/system";
import Link from "next/link";
import { ReactElement, useState } from "react";

export interface TagTooltipProps {
    tagId?: string;
    name: string;
    description?: string;
    children: ReactElement;
    fetchDescription?: () => Promise<string>;
}

export const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
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
    const { name, tagId, description: initialDescription, children, fetchDescription } = params;
    const [description, setDescription] = useState(initialDescription);
    const [isLoading, setIsLoading] = useState(false);

    const handleTooltipOpen = async () => {
        if ((!description || description === '') && fetchDescription && !isLoading) {
            setIsLoading(true);
            try {
                const fetchedDescription = await fetchDescription();
                setDescription(fetchedDescription);
            } catch (error) {
                console.error('Failed to fetch description:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div>
            <HtmlTooltip
                title={
                    <div className={'text-xs'}>
                        <div className={'font-semibold'}>{name}</div>
                        <div className={'mt-2'}>
                            {isLoading ? 'Loading...' : description || 'No description available'}
                            <Link
                                href={`/wiki/${tagId}/${name}`}
                                className="w-full block py-2 bg-blue-700 text-white mt-5 rounded-full text-center">Watch wiki</Link>
                        </div>
                    </div>
                }
                placement="bottom"
                onOpen={handleTooltipOpen}
            >
                {children}
            </HtmlTooltip>
        </div>
    );
}