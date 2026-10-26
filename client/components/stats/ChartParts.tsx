import { compact } from "./scale";

export interface SeriesInfo {
    key: string;
    label: string;
    color: string;
}

export interface Series extends SeriesInfo {
    values: number[];
}

/** A small key for a series: a rounded square for bars, a short stroke for lines. */
export function Swatch({ color, kind }: { color: string; kind: "bar" | "line" }) {
    return kind === "bar" ? (
        <svg width="10" height="10" aria-hidden className="shrink-0">
            <rect width="10" height="10" rx="2" fill={color} />
        </svg>
    ) : (
        <svg width="14" height="10" aria-hidden className="shrink-0">
            <line x1="1" x2="13" y1="5" y2="5" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

/** The legend row above a chart. Text stays in the muted text token; the swatch carries the colour. */
export function Legend({ series, kind }: { series: SeriesInfo[]; kind: "bar" | "line" }) {
    return (
        <ul className="mb-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
            {series.map((s) => (
                <li key={s.key} className="flex items-center gap-1.5">
                    <Swatch color={s.color} kind={kind} />
                    {s.label}
                </li>
            ))}
        </ul>
    );
}

interface TooltipProps {
    title: string;
    rows: { label: string; value: number; color: string }[];
    x: number;               // pixels from the left of the chart container
    containerWidth: number;
}

/** The hover readout: the value leads, the series name follows. It flips to the other side of the pointer near the right edge. */
export function Tooltip({ title, rows, x, containerWidth }: TooltipProps) {
    const flip = x > containerWidth / 2;
    return (
        <div
            className="pointer-events-none absolute top-1 z-10 whitespace-nowrap rounded-lg border border-border bg-surface-raised px-2.5 py-1.5 text-xs shadow-xl shadow-black/40"
            style={{ left: x, transform: `translateX(${flip ? "calc(-100% - 10px)" : "10px"})` }}
        >
            <p className="mb-1 text-muted">{title}</p>
            {rows.map((row) => (
                <p key={row.label} className="flex items-center gap-1.5">
                    <Swatch color={row.color} kind="line" />
                    <span className="font-semibold text-text">{compact(row.value)}</span>
                    <span className="text-muted">{row.label}</span>
                </p>
            ))}
        </div>
    );
}
