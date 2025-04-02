'use client'

import AccessDenied from "@/components/Privilege/AccessDenied";
import ModeratorPrivilege from "@/components/Privilege/ModeratorPrivilege";
import { AssignmentLate, QuestionAnswer } from "@mui/icons-material";
import { Paper, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import QuestionsTable from "./QuestionsTable";
import ReportsTable from "./ReportsTable";

export default function ModeratorPage() {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    return (
        <ModeratorPrivilege fallBackComponent={<AccessDenied />}>
            <div className="page-container mx-auto">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-xl p-6 shadow-md">
                    <h1 className="text-2xl font-bold text-white">Moderator Dashboard</h1>
                    <p className="text-purple-100 mt-1">Manage reports and questions</p>
                </div>

                <Paper>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        variant="fullWidth"
                        className="bg-[var(--background)] [&_button]:text-[var(--text-primary)]"
                    >
                        <Tab
                            label="Reports"
                            icon={<AssignmentLate />}
                            iconPosition="start"
                            className="py-4"
                        />
                        <Tab
                            label="Questions"
                            icon={<QuestionAnswer />}
                            iconPosition="start"
                            className="py-4"
                        />
                    </Tabs>
                </Paper>

                {activeTab === 0 && <ReportsTable />}
                {activeTab === 1 && <QuestionsTable />}
            </div>
        </ModeratorPrivilege>
    )
}