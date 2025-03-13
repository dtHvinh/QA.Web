import { TrendingFlat } from "@mui/icons-material";

export default function TrendingFlatDisplay({ percentage }: { percentage: number }) {
    return (
        <span className="flex items-center text-sm font-medium text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full">
            <TrendingFlat className="h-4 w-4 mr-1" />
            {percentage}%
        </span>
    )
}