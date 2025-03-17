import { HtmlTooltip } from "@/components/TagTooltip";
import { ArrowDropDown } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";

interface FilterBarProps {
    tabs: string[];
    tabValues: string[];
    tabDescriptions: string[];
    defaultIndex?: number;
    onFilterValueChange: (filter: string) => void;
}

const FilterBar = (params: Readonly<FilterBarProps>) => {
    const { tabs, tabValues, tabDescriptions, onFilterValueChange, defaultIndex } = params;
    const [activeTab, setActiveTab] = useState(tabs[defaultIndex ?? 0]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleSelect = (tab: string, value: string) => {
        setActiveTab(tab);
        onFilterValueChange(value);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <div className="flex items-center">
                <span className="text-sm font-medium text-[var(--text-secondary)] mr-2">Sort by</span>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[var(--hover-background)] border border-[var(--border-color)] text-[var(--text-primary)]"
                >
                    <span className="text-sm font-medium">{activeTab}</span>
                    <ArrowDropDown fontSize="small" />
                </button>
            </div>

            {isOpen && (
                <div className="absolute z-10 mt-1 w-32 bg-[var(--card-background)] rounded-lg shadow-lg border border-[var(--border-color)] overflow-hidden">
                    {tabs.map((label, index) => (
                        <HtmlTooltip
                            key={label}
                            title={tabDescriptions[index]}
                            placement="right"
                            arrow
                        >
                            <button
                                className={`w-full text-left px-4 py-2 text-sm transition-colors
                                    ${activeTab === label
                                        ? "bg-[var(--primary-light)] text-[var(--primary)]"
                                        : "text-[var(--text-primary)] hover:bg-[var(--hover-background)]"}`}
                                onClick={() => handleSelect(label, tabValues[index])}
                            >
                                {label}
                            </button>
                        </HtmlTooltip>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FilterBar;