import TrendingDownDisplay from "./TrendingDownDisplay"
import TrendingFlatDisplay from "./TrendingFlatDisplay"
import TrendingUpDisplay from "./TrendingUpDisplay"

export default function TrendingDisplay({ percentage }: { percentage: number }) {
    if (percentage > 0) {
        return <TrendingUpDisplay percentage={percentage} />
    } else if (percentage < 0) {
        return <TrendingDownDisplay percentage={percentage} />
    }
    else
        return <TrendingFlatDisplay percentage={percentage} />
}