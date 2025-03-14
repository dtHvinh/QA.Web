import { HtmlTooltip } from "@/components/TagTooltip";
import { motion } from "framer-motion";
import { useState } from "react";

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

    const innerOnFilterValueChange = (tab: string, value: string) => {
        setActiveTab(tab);
        onFilterValueChange(value);
    }

    return (
        <div className="flex items-center gap-1 p-1 bg-[var(--hover-background)]/50 rounded-xl border border-[var(--border-color)]">
            {tabs.map((label, index) => (
                <HtmlTooltip
                    title={tabDescriptions[index]}
                    key={label}
                    placement="top"
                    arrow
                >
                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        className={`relative px-4 py-2 rounded-lg transition-all duration-200 ${activeTab === label
                            ? "text-blue-500 bg-[var(--card-background)] shadow-sm"
                            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-background)]"
                            }`}
                        onClick={() => innerOnFilterValueChange(label, tabValues[index])}
                    >
                        <span className="relative z-10 text-sm font-medium">{label}</span>
                        {activeTab === label && (
                            <div
                                className="absolute inset-0 bg-[var(--card-background)] rounded-lg shadow-sm"
                            />
                        )}
                    </motion.button>
                </HtmlTooltip>
            ))}
        </div>
    );
};

export default FilterBar;