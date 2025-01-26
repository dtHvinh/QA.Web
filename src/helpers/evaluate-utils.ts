export function isTrue(value: boolean): number {
    return value ? 1 : 0;
}

export function formatNumber(value: number): string {
    const billion = value / 1000000000;
    const million = value / 1000000;
    const thousand = value / 1000;

    if (billion >= 1) {
        return `${billion.toFixed(1)}B`;
    }
    if (million >= 1) {
        return `${million.toFixed(1)}M`;
    }
    if (thousand >= 1) {
        return `${thousand.toFixed(1)}K`;
    }

    return value.toString();
}