import TrendingDisplay from "@/components/NumericDisplay/TrendingDisplay";
import { formatNumber } from "@/helpers/evaluate-utils";
import { AnalyticResponse } from "@/types/types";
import React from "react";

export default function StatisticBox({ icon, period, analytic }: { icon: React.ReactNode, period: string, analytic: AnalyticResponse }) {
    return (
        <div className="bg-[var(--card-background)] rounded-xl shadow-sm p-6 border border-[var(--border-color)]">
            <div className="flex items-center justify-between mb-4">
                {icon}
                <TrendingDisplay percentage={analytic.growthPercentage} />
            </div>
            <h3 className="text-[var(--text-secondary)] text-sm font-medium mb-1">Total Users</h3>
            <div className="flex items-baseline">
                <span className="text-3xl font-bold text-[var(--text-primary)]">{formatNumber(analytic.currentCount)}</span>
                {period == 'Daily' ?
                    <span className="ml-2 text-sm text-[var(--text-secondary)]">compare to yesterday {formatNumber(analytic.previousCount)}</span>
                    : <span className="ml-2 text-sm text-[var(--text-secondary)]">compare to last {period.toLowerCase().slice(0, -2)} {formatNumber(analytic.previousCount)}</span>
                }
            </div>
        </div>
    )
}