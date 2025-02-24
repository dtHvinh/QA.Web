'use client'

import AdminPrivilege from '@/components/Privilege/AdminPrivilege';
import getAuth from '@/helpers/auth-utils';
import { formatNumber } from '@/helpers/evaluate-utils';
import {
    Info,
    PeopleOutline,
    QuestionAnswer,
    QuestionMark,
    QuestionMarkOutlined,
    TrendingDown,
    TrendingUp,
} from '@mui/icons-material';
import { Typography } from '@mui/material';
import { Tooltip } from '@mui/material';

export default function AdminDashboard() {
    const auth = getAuth();

    return (
        <AdminPrivilege>
            <div className="p-6">
                <Typography variant="h4" className="mb-6">Hello, {auth?.username}</Typography>

                <div className="grid gap-3 mt-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="flex border rounded-lg divide-x col-span-4 p-4">
                            <div className="p-4 flex-grow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Typography color="textSecondary" className={'flex items-stretch gap-1'}>
                                            Total Users
                                            <Tooltip title="The total number of users who have joined the platform" arrow>
                                                <Info fontSize='small' />
                                            </Tooltip>
                                        </Typography>
                                        <div className="flex items-center gap-2">
                                            <Typography variant="h4">{formatNumber(1234)}</Typography>
                                            <div className="flex flex-col justify-center">
                                                <div className="flex items-center gap-1">
                                                    <TrendingUp className="text-green-500" fontSize="small" />
                                                    <span className="text-green-500 text-sm">+5.2%</span>
                                                </div>
                                                <span className="text-xs text-neutral-500">vs previous week</span>
                                            </div>
                                        </div>
                                    </div>
                                    <PeopleOutline className="text-blue-500" />
                                </div>
                            </div>

                            <div className="p-4 flex-grow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Typography color="textSecondary" className={'flex items-stretch gap-1'}>
                                            Questions
                                            <Tooltip title="The total number of questions" arrow>
                                                <Info fontSize='small' />
                                            </Tooltip>
                                        </Typography>
                                        <div className="flex items-center gap-2">
                                            <Typography variant="h4">{formatNumber(1234)}</Typography>
                                            <div className="flex flex-col justify-center">
                                                <div className="flex items-center gap-1">
                                                    <TrendingDown className="text-red-500" fontSize="small" />
                                                    <span className="text-red-500 text-sm">-2.1%</span>
                                                </div>
                                                <span className="text-xs text-neutral-500">vs previous week</span>
                                            </div>
                                        </div>
                                    </div>
                                    <QuestionMarkOutlined className="text-green-500" />
                                </div>
                            </div>

                            <div className="p-4 flex-grow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Typography color="textSecondary" className={'flex items-stretch gap-1'}>
                                            Answers
                                            <Tooltip title="The total number of answers" arrow>
                                                <Info fontSize='small' />
                                            </Tooltip>
                                        </Typography>
                                        <div className="flex items-center gap-2">
                                            <Typography variant="h4">{formatNumber(1234)}</Typography>
                                            <div className="flex flex-col justify-center">
                                                <div className="flex items-center gap-1">
                                                    <TrendingUp className="text-green-500" fontSize="small" />
                                                    <span className="text-green-500 text-sm">+8.7%</span>
                                                </div>
                                                <span className="text-xs text-neutral-500">vs previous week</span>
                                            </div>
                                        </div>
                                    </div>
                                    <QuestionAnswer className="text-green-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-4">
                        <Typography variant="h6" className="mb-4">Quick Actions</Typography>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                            <button className="w-full p-4 text-left hover:bg-gray-50 rounded">
                                <Typography variant="subtitle1">User Management</Typography>
                                <Typography color="textSecondary">
                                    Manage users and roles
                                </Typography>
                            </button>
                            <button className="w-full p-4 text-left hover:bg-gray-50 rounded">
                                <Typography variant="subtitle1">Content Moderation</Typography>
                                <Typography color="textSecondary">
                                    Review reported content
                                </Typography>
                            </button>
                            <button className="w-full p-4 text-left hover:bg-gray-50 rounded">
                                <Typography variant="subtitle1">System Settings</Typography>
                                <Typography color="textSecondary">
                                    Configure platform settings
                                </Typography>
                            </button>
                        </div>
                    </div>

                    <div className="p-4">
                        <Typography variant="h6" className="mb-4">Recent Activity</Typography>
                    </div>
                </div>
            </div>
        </AdminPrivilege>
    );
}