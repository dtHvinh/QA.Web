'use client'

import AccessDenied from '@/components/Privilege/AccessDenied';
import AdminPrivilege from '@/components/Privilege/AdminPrivilege';
import getAuth from '@/helpers/auth-utils';
import { formatNumber } from '@/helpers/evaluate-utils';
import {
    LocalOfferOutlined,
    PeopleOutline,
    QuestionAnswer,
    QuestionMarkOutlined,
    SettingsOutlined,
    TrendingDown,
    TrendingUp
} from '@mui/icons-material';

export default function AdminDashboard() {
    const auth = getAuth();

    return (
        <AdminPrivilege fallBackComponent={<AccessDenied />}>
            <div className="min-h-[calc(100vh-var(--appbar-height))]">
                <div className="max-w-7xl mx-auto p-6">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 mb-6 shadow-md">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/20 rounded-lg">
                                <SettingsOutlined className="text-white" fontSize="large" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                                <p className="text-blue-100">Welcome back, {auth?.username}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <PeopleOutline className="text-blue-600" />
                                </div>
                                <span className="flex items-center text-sm font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                                    <TrendingUp className="h-4 w-4 mr-1" />
                                    +5.2%
                                </span>
                            </div>
                            <h3 className="text-gray-500 text-sm font-medium mb-1">Total Users</h3>
                            <div className="flex items-baseline">
                                <span className="text-3xl font-bold text-gray-900">{formatNumber(1234)}</span>
                                <span className="ml-2 text-sm text-gray-500">from last week</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <QuestionMarkOutlined className="text-green-600" />
                                </div>
                                <span className="flex items-center text-sm font-medium text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                                    <TrendingDown className="h-4 w-4 mr-1" />
                                    -2.1%
                                </span>
                            </div>
                            <h3 className="text-gray-500 text-sm font-medium mb-1">Questions</h3>
                            <div className="flex items-baseline">
                                <span className="text-3xl font-bold text-gray-900">{formatNumber(1234)}</span>
                                <span className="ml-2 text-sm text-gray-500">from last week</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-purple-50 rounded-lg">
                                    <QuestionAnswer className="text-purple-600" />
                                </div>
                                <span className="flex items-center text-sm font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                                    <TrendingUp className="h-4 w-4 mr-1" />
                                    +8.7%
                                </span>
                            </div>
                            <h3 className="text-gray-500 text-sm font-medium mb-1">Answers</h3>
                            <div className="flex items-baseline">
                                <span className="text-3xl font-bold text-gray-900">{formatNumber(1234)}</span>
                                <span className="ml-2 text-sm text-gray-500">from last week</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <button className="flex items-start p-5 bg-white border border-gray-200 rounded-xl hover:border-purple-500 hover:shadow-md transition-all group">
                                <div className="mr-4 p-3 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                                    <PeopleOutline className="text-purple-600" />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-purple-700">User Management</h3>
                                    <p className="text-sm text-gray-500">Manage users and roles</p>
                                </div>
                            </button>

                            <button className="flex items-start p-5 bg-white border border-gray-200 rounded-xl hover:border-yellow-500 hover:shadow-md transition-all group">
                                <div className="mr-4 p-3 bg-yellow-50 rounded-lg group-hover:bg-yellow-100 transition-colors">
                                    <LocalOfferOutlined className="text-yellow-600" />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-yellow-700">Tag Management</h3>
                                    <p className="text-sm text-gray-500">Create or edit tags</p>
                                </div>
                            </button>

                            <button className="flex items-start p-5 bg-white border border-gray-200 rounded-xl hover:border-indigo-500 hover:shadow-md transition-all group">
                                <div className="mr-4 p-3 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                                    <SettingsOutlined className="text-indigo-600" />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-indigo-700">System Settings</h3>
                                    <p className="text-sm text-gray-500">Configure platform settings</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminPrivilege>
    );
}