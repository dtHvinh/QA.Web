export const DEFAULT_TIME = "0001-01-01T00:00:00";

const specificTime = (date: Date) => {
    return date.toLocaleTimeString('vi', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

export function formatTimeString(utcTimeString: string): string {
    const date = new Date(utcTimeString + (utcTimeString.endsWith('Z') ? '' : 'Z'));
    const now = new Date();
    const lang = navigator.language;
    const isToday = date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

    if (isToday) {
        return date.toLocaleTimeString(lang, {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    } else {
        return date.toLocaleDateString(lang, {
            month: 'short',
            day: 'numeric'
        }) + ' at ' + date.toLocaleTimeString(lang, {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }
}

export default function timeFromNow(dateTimeString: string): string {
    const date = new Date(dateTimeString + (dateTimeString.endsWith('Z') ? '' : 'Z'));
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInMs < 60000) {
        return 'just now';
    }

    if (diffInDays < 1) {
        const diffInHours = diffInMs / (1000 * 60 * 60);
        if (diffInHours < 1) {
            const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
            return `${diffInMinutes}m`;
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