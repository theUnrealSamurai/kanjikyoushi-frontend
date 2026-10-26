// Pure helpers for the stats charts: tick and label scaling, date formatting, bar geometry.

/** Round tick values from 0 up past `max`, whole numbers only. An all-zero chart still gets a sane 0-4 axis. */
export function niceTicks(max: number, target = 4): number[] {
    const top = max > 0 ? max : target;
    const rough = top / target;
    const pow = 10 ** Math.floor(Math.log10(rough));
    const frac = rough / pow;
    const step = Math.max(1, (frac <= 1 ? 1 : frac <= 2 ? 2 : frac <= 5 ? 5 : 10) * pow);
    const ticks: number[] = [];
    for (let v = 0; v < top + step; v += step) {
        ticks.push(v);
        if (v >= top) break;
    }
    return ticks;
}

/** 0 / 999 / 1.2K / 12K / 3M */
export function compact(n: number): string {
    const abs = Math.abs(n);
    if (abs < 1000) return String(n);
    const [value, unit] = abs < 1_000_000 ? [n / 1000, "K"] : [n / 1_000_000, "M"];
    return `${value.toFixed(value < 10 ? 1 : 0).replace(/\.0$/, "")}${unit}`;
}

/** Label every k-th category (counting back from the last, so "today" is always labelled) so labels never touch. */
export function labelEvery(band: number, minGap = 44): number {
    return Math.max(1, Math.ceil(minGap / Math.max(band, 1)));
}

const parts = (iso: string) => iso.split("-").map(Number);

/** "2026-10-26" -> "10/26" */
export function shortDate(iso: string): string {
    const [, month, day] = parts(iso);
    return `${month}/${day}`;
}

/** "2026-10-26" -> "Mon, Oct 26" */
export function longDate(iso: string): string {
    const [year, month, day] = parts(iso);
    return new Date(year, month - 1, day).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

/** "2026-10-26" -> "Oct 26, 2026" */
export function fullDate(iso: string): string {
    const [year, month, day] = parts(iso);
    return new Date(year, month - 1, day).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

/** SVG path for a vertical bar: square at the baseline (bottom), optionally rounded at the data end (top). */
export function barPath(x: number, y: number, w: number, h: number, radius: number, roundTop: boolean): string {
    const r = roundTop ? Math.min(radius, w / 2, h) : 0;
    const bottom = y + h;
    if (r <= 0) return `M${x},${bottom}V${y}H${x + w}V${bottom}Z`;
    return `M${x},${bottom}V${y + r}A${r},${r} 0 0 1 ${x + r},${y}H${x + w - r}A${r},${r} 0 0 1 ${x + w},${y + r}V${bottom}Z`;
}

/** Index of the category under a pointer `px` pixels from the left edge of the plot, or null outside it. */
export function bandIndex(px: number, band: number, count: number): number | null {
    if (px < 0 || band <= 0 || count === 0) return null;
    return Math.min(count - 1, Math.floor(px / band));
}

/** Index of the point nearest a pointer `px` pixels from the left edge of the plot (points `step` apart). */
export function nearestIndex(px: number, step: number, count: number): number {
    if (count <= 1 || step <= 0) return 0;
    return Math.max(0, Math.min(count - 1, Math.round(px / step)));
}
