import React, {useState} from "react";
import {HtmlTooltip} from "@/components/TagTooltip";

interface FilterBarProps {
    tabs: string[];
    tabValues: string[];
    tabDescriptions: string[];
    onFilterValueChange: (filter: string) => void;
}

const FilterBar = (params: Readonly<FilterBarProps>) => {
    const {tabs, tabValues, tabDescriptions, onFilterValueChange} = params;
    const [activeTab, setActiveTab] = useState(tabs[0]);

    const innerOnFilterValueChange = (tab: string, value: string) => {
        setActiveTab(tab);
        onFilterValueChange(value);
    }

    return (
        <div className="text-sm flex items-center space-x-4 py-2 px-2 border-[1px] rounded-lg border-gray-200">
            {tabs.map((label, index) => (
                <HtmlTooltip title={tabDescriptions[index]} key={label}>
                    <button
                        className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                            activeTab === label
                                ? "bg-blue-100 text-blue-800"
                                : "text-gray-600 hover:bg-gray-100"
                        }`}
                        onClick={() => innerOnFilterValueChange(label, tabValues[index])}
                    >
                        <span className="font-medium">{label}</span>
                    </button>
                </HtmlTooltip>
            ))}
        </div>
    );
};

export default FilterBar;