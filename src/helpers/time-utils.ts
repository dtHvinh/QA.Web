export const DEFAULT_TIME = "0001-01-01T00:00:00";

const specificTime = (date: Date) => {
    return date.toLocaleTimeString('vi', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

export default function timeFromNow(dateTimeString: string): string {
    const date = new Date(dateTimeString + (dateTimeString.endsWith('Z') ? '' : 'Z')); // Ensure the date is treated as UTC
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInDays < 1) {
        const diffInHours = diffInMs / (1000 * 60 * 60);
        if (diffInHours < 1) {
            const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
            const diffInSeconds = Math.floor((diffInMs % (1000 * 60)) / 1000);
            return `${diffInMinutes}m ${diffInSeconds}s`;
        }
        return `${Math.floor(diffInHours)}h, at ${specificTime(date)}`;
    } else if (diffInDays < 7) {
        return `${Math.floor(diffInDays)}d, at ${specificTime(date)}`;
    } else {
        return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    }
}

export function countTotalDays(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    return date.toLocaleString("en-US") + " - " + Math.floor(diffInMs / (1000 * 60 * 60 * 24)) + " days";
}