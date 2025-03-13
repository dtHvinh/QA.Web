import { TrendingUp } from "@mui/icons-material";

export default function TrendingUpDisplay({ percentage }: { percentage: number }) {
    return (
        <span className="flex items-center text-sm font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
            <TrendingUp className="h-4 w-4 mr-1" />
            +{percentage}%
        </span>
    )
}