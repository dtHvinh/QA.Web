import { TrendingDown } from "@mui/icons-material";

export default function TrendingDownDisplay({ percentage }: { percentage: number }) {
    return (
        <span className="flex items-center text-sm font-medium text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
            <TrendingDown className="h-4 w-4 mr-1" />
            {percentage}%
        </span>
    )
}