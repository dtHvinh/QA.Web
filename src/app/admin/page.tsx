'use client'

import FilterBar from '@/components/FilterBar';
import AccessDenied from '@/components/Privilege/AccessDenied';
import AdminPrivilege from '@/components/Privilege/AdminPrivilege';
import getAuth from '@/helpers/auth-utils';
import { getFetcher } from '@/helpers/request-utils';
import { AnalyticResponse } from '@/types/types';
import {
    PeopleOutline,
    PlagiarismOutlined,
    QuestionAnswer,
    QuestionMarkOutlined,
    SettingsOutlined
} from '@mui/icons-material';
import Link from 'next/link';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import AALS from './AALS';
import StatisticBox from './StatisticBox';

export default function AdminDashboard() {
    const auth = getAuth();

    const periodVals = ['Daily', 'Weekly', 'Monthly', 'Yearly'];
    const periods = ['Daily', 'Weekly', 'Monthly', 'Yearly'];
    const periodDes = ['', '', '', ''];

    const [questionAnalytic, setQuestionAnalytic] = useState<AnalyticResponse>()
    const [userAnalytic, setUserAnalytic] = useState<AnalyticResponse>()
    const [answerAnalytic, setAnswerAnalytic] = useState<AnalyticResponse>()
    const [period, setPeriod] = useState(periodVals[1]);

    useEffect(() => {
        async function fetchAnalytic(what: string, setAction: Dispatch<SetStateAction<AnalyticResponse | undefined>>) {
            const res = await getFetcher([`/api/admin/analytic/${what}/${period}`, auth!.accessToken])
            console.log(res);
            setAction(res);
        }

        const q = fetchAnalytic('question', setQuestionAnalytic).then();
        const u = fetchAnalytic('user', setUserAnalytic).then();
        const a = fetchAnalytic('answer', setAnswerAnalytic).then();
    }, [period])

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

                    <div className='flex justify-end pb-5'>
                        <FilterBar
                            defaultIndex={1}
                            onFilterValueChange={setPeriod}
                            tabDescriptions={periodDes}
                            tabValues={periodVals}
                            tabs={periods} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        {userAnalytic ?
                            <StatisticBox icon={
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <PeopleOutline className="text-blue-600" />
                                </div>} period={period} analytic={userAnalytic} />
                            :
                            <AALS />
                        }

                        {questionAnalytic ?
                            <StatisticBox icon={
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <QuestionMarkOutlined className="text-green-600" />
                                </div>} period={period} analytic={questionAnalytic} />
                            : <AALS />
                        }

                        {answerAnalytic ?
                            <StatisticBox icon={
                                <div className="p-3 bg-purple-50 rounded-lg">
                                    <QuestionAnswer className="text-purple-600" />
                                </div>} period={period} analytic={answerAnalytic} />
                            : <AALS />
                        }
                    </div>

                    <div className="bg-[var(--card-background)] rounded-xl shadow-sm p-6 border border-gray-100">
                        <h2 className="text-xl font-bold text-[var(--text-primary)]0 mb-6">Quick Actions</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Link href='/admin/user-management' className="flex items-start p-5 bg-white border border-gray-200 rounded-xl hover:border-purple-500 hover:shadow-md transition-all group">
                                <div className="mr-4 p-3 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                                    <PeopleOutline className="text-purple-600" />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-purple-700">User Management</h3>
                                    <p className="text-sm text-gray-500">Manage users and roles</p>
                                </div>
                            </Link>

                            <Link href='/admin/logs' className="flex items-start p-5 bg-white border border-gray-200 rounded-xl hover:border-yellow-500 hover:shadow-md transition-all group">
                                <div className="mr-4 p-3 bg-yellow-50 rounded-lg group-hover:bg-orange-100 transition-colors">
                                    <PlagiarismOutlined className="text-yellow-600" />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-orange-700">Logs</h3>
                                    <p className="text-sm text-gray-500">View system logs and activities</p>
                                </div>
                            </Link>

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