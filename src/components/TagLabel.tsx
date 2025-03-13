import TagTooltip from "@/components/TagTooltip";

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
            <button type={"button"} onClick={() => onClick ? onClick(name) : null}>
                <div className={`${className} inline-block relative py-1 text-xs`}>
                    <div className={`absolute inset-0 text-gray-200 flex`}>
                        <svg height="100%" viewBox="0 0 50 100">
                            <path
                                d="M49.9,0a17.1,17.1,0,0,0-12,5L5,37.9A17,17,0,0,0,5,62L37.9,94.9a17.1,17.1,0,0,0,12,5ZM25.4,59.4a9.5,9.5,0,1,1,9.5-9.5A9.5,9.5,0,0,1,25.4,59.4Z"
                                fill="currentColor" />
                        </svg>
                        <div className={`flex-grow h-full -ml-px bg-gray-200 rounded-md rounded-l-none`}></div>
                    </div>
                    <span className={`relative text-gray-500 p-1 pr-px`}>
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>{name}<span>&nbsp;</span>
                    </span>
                </div>
            </button>
        </TagTooltip>
    );
}