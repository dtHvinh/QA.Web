import TrendingDisplay from "@/components/NumericDisplay/TrendingDisplay";
import { formatNumber } from "@/helpers/evaluate-utils";
import { AnalyticResponse } from "@/types/types";
import React from "react";

export default function StatisticBox({ icon, period, analytic }: { icon: React.ReactNode, period: string, analytic: AnalyticResponse }) {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                {icon}
                <TrendingDisplay percentage={analytic.growthPercentage} />
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">Total Users</h3>
            <div className="flex items-baseline">
                <span className="text-3xl font-bold text-gray-900">{formatNumber(analytic.currentCount)}</span>
                {period == 'Daily' ?
                    <span className="ml-2 text-sm text-gray-500">compare to yesterday {formatNumber(analytic.previousCount)}</span>
                    : <span className="ml-2 text-sm text-gray-500">compare to last {period.toLowerCase().slice(0, -2)} {formatNumber(analytic.previousCount)}</span>
                }
            </div>
        </div>
    )
}