import React, { useState } from "react";
import { HtmlTooltip } from "@/components/TagTooltip";
import { motion } from "framer-motion";

interface FilterBarProps {
    tabs: string[];
    tabValues: string[];
    tabDescriptions: string[];
    onFilterValueChange: (filter: string) => void;
}

const FilterBar = (params: Readonly<FilterBarProps>) => {
    const { tabs, tabValues, tabDescriptions, onFilterValueChange } = params;
    const [activeTab, setActiveTab] = useState(tabs[0]);

    const innerOnFilterValueChange = (tab: string, value: string) => {
        setActiveTab(tab);
        onFilterValueChange(value);
    }

    return (
        <div className="flex items-center gap-1 p-1 bg-gray-50/50 rounded-xl border border-gray-100">
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
                            ? "text-blue-600 bg-white shadow-sm"
                            : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                            }`}
                        onClick={() => innerOnFilterValueChange(label, tabValues[index])}
                    >
                        <span className="relative z-10 text-sm font-medium">{label}</span>
                        {activeTab === label && (
                            <div
                                className="absolute inset-0 bg-white rounded-lg shadow-sm"
                            />
                        )}
                    </motion.button>
                </HtmlTooltip>
            ))}
        </div>
    );
};

export default FilterBar;