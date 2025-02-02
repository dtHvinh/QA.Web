export const DEFAULT_TIME = "0001-01-01T00:00:00";

export default function timeFromNow(dateTimeString: string): string {
    const date = new Date(dateTimeString + 'Z'); // Ensure the date is treated as UTC
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInDays < 1) {
        const diffInHours = diffInMs / (1000 * 60 * 60);
        if (diffInHours < 1) {
            const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
            const diffInSeconds = Math.floor((diffInMs % (1000 * 60)) / 1000);
            return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} and ${diffInSeconds} second${diffInSeconds !== 1 ? "s" : ""} ago`;
        }
        return `${Math.floor(diffInHours)} hour${Math.floor(diffInHours) !== 1 ? "s" : ""} ago`;
    } else if (diffInDays < 7) {
        return `${Math.floor(diffInDays)} day${Math.floor(diffInDays) !== 1 ? "s" : ""} ago`;
    } else {
        return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    }
}