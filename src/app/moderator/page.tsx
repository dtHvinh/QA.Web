'use client'

import AccessDenied from "@/components/Privilege/AccessDenied";
import ModeratorPrivilege from "@/components/Privilege/ModeratorPrivilege";
import { Tabs } from "radix-ui";
import QuestionsTable from "./QuestionsTable";
import ReportsTable from "./ReportsTable";

export default function ModeratorPage() {
    return (
        <ModeratorPrivilege fallBackComponent={<AccessDenied />}>
            <div className="page-container mx-auto">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-xl p-6 shadow-md">
                    <h1 className="text-2xl font-bold text-white">Moderator Dashboard</h1>
                    <p className="text-purple-100 mt-1">Manage reports and questions</p>
                </div>

                <Tabs.Root defaultValue="reports" className="mt-2">
                    <Tabs.List className="flex p-1 gap-1 items-center bg-[var(--card-background)] rounded-lg border border-[var(--border-color)] mb-4">
                        <Tabs.Trigger
                            value="reports"
                            className="flex-1 px-4 py-2.5 flex items-center justify-center gap-2 text-[var(--text-secondary)]
                                data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white
                                rounded-md transition-all duration-200"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Reports
                        </Tabs.Trigger>
                        <Tabs.Trigger
                            value="questions"
                            className="flex-1 px-4 py-2.5 flex items-center justify-center gap-2 text-[var(--text-secondary)]
                                data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white
                                rounded-md transition-all duration-200"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Questions
                        </Tabs.Trigger>
                    </Tabs.List>

                    <Tabs.Content value="reports">
                        <ReportsTable />
                    </Tabs.Content>

                    <Tabs.Content value="questions">
                        <QuestionsTable />
                    </Tabs.Content>
                </Tabs.Root>
            </div>
        </ModeratorPrivilege>
    )
}