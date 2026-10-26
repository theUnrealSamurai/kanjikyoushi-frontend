"use client";

import { KeyboardEvent, PointerEvent, useState } from "react";
import { Legend, Series, Tooltip } from "./ChartParts";
import { bandIndex, barPath, compact, labelEvery, niceTicks } from "./scale";
import { useWidth } from "./useWidth";

interface Props {
    labels: string[];       // short axis label per category
    titles: string[];       // full name per category, for the tooltip
    series: Series[];       // stacked in order, first at the baseline
    height: number;         // total height, including the axis labels
    ariaLabel: string;
    legend?: boolean;       // default: shown when there are two or more series
    valueLabels?: boolean;  // print each bar's total on its cap (only for a handful of bars)
    emptyNote?: string;     // shown over the empty plot when every value is zero
}

const MARGIN = { left: 32, right: 12, top: 8, bottom: 22 };
const MAX_THICKNESS = 24;
const GAP = 2;     // surface-coloured gap between stacked segments
const RADIUS = 4;  // rounded data end

/** Vertical (stacked) bar chart in plain SVG, drawn at the container's real pixel width. Hover, touch or the
 *  arrow keys pick a category; one tooltip lists every series for it. */
export default function BarChart({ labels, titles, series, height, ariaLabel, legend, valueLabels, emptyNote }: Props) {
    const [ref, width] = useWidth<HTMLDivElement>();
    const [active, setActive] = useState<number | null>(null);

    const count = labels.length;
    const top = valueLabels ? MARGIN.top + 12 : MARGIN.top;
    const plotWidth = Math.max(0, width - MARGIN.left - MARGIN.right);
    const plotHeight = height - top - MARGIN.bottom;
    const band = count > 0 ? plotWidth / count : 0;
    const thickness = Math.min(MAX_THICKNESS, Math.max(1.5, band * (band >= 8 ? 0.6 : 0.75)));

    const totals = labels.map((_, i) => series.reduce((sum, s) => sum + s.values[i], 0));
    const ticks = niceTicks(Math.max(0, ...totals));
    const ceiling = ticks[ticks.length - 1];
    const y = (value: number) => top + plotHeight - (value / ceiling) * plotHeight;
    const every = labelEvery(band);
    const empty = totals.every((total) => total === 0);

    const onPointer = (e: PointerEvent<SVGRectElement>) => {
        const box = e.currentTarget.getBoundingClientRect();
        setActive(bandIndex(e.clientX - box.left, band, count));
    };
    const onKey = (e: KeyboardEvent<SVGSVGElement>) => {
        const last = count - 1;
        const moves: Record<string, number> = { ArrowLeft: (active ?? last + 1) - 1, ArrowRight: (active ?? -1) + 1, Home: 0, End: last };
        const next = moves[e.key];
        if (typeof next !== "number") return;
        e.preventDefault();
        setActive(Math.max(0, Math.min(last, next)));
    };

    return (
        <div>
            {(legend ?? series.length >= 2) && <Legend series={series} kind="bar" />}
            <div ref={ref} className="relative" style={{ height }}>
                {width > 0 && (
                    <svg
                        width={width}
                        height={height}
                        role="group"
                        aria-label={`${ariaLabel}. Arrow keys move between bars; the Table button lists every value.`}
                        tabIndex={0}
                        onKeyDown={onKey}
                        onBlur={() => setActive(null)}
                        className="block rounded-md"
                    >
                        {ticks.map((tick) => (
                            <g key={tick}>
                                <line x1={MARGIN.left} x2={width - MARGIN.right} y1={y(tick)} y2={y(tick)} className="stroke-surface-raised" strokeWidth={1} />
                                <text x={MARGIN.left - 6} y={y(tick) + 4} textAnchor="end" className="fill-muted text-[11px] tabular-nums">{compact(tick)}</text>
                            </g>
                        ))}
                        <line x1={MARGIN.left} x2={width - MARGIN.right} y1={y(0)} y2={y(0)} className="stroke-border" strokeWidth={1} />

                        {active !== null && (
                            <rect x={MARGIN.left + band * active} y={top} width={band} height={plotHeight} className="fill-text/5" />
                        )}

                        {labels.map((label, i) => {
                            const x = MARGIN.left + band * i + (band - thickness) / 2;
                            const filled = series.filter((s) => s.values[i] > 0);
                            let acc = 0;
                            return (
                                <g key={i}>
                                    {filled.map((s, j) => {
                                        const bottom = y(acc) - (j > 0 ? GAP : 0);
                                        const cap = y(acc + s.values[i]);
                                        acc += s.values[i];
                                        return <path key={s.key} d={barPath(x, cap, thickness, Math.max(1, bottom - cap), RADIUS, j === filled.length - 1)} fill={s.color} />;
                                    })}
                                    {valueLabels && (
                                        <text x={x + thickness / 2} y={y(totals[i]) - 5} textAnchor="middle" className="fill-text text-[11px] font-semibold tabular-nums">{totals[i]}</text>
                                    )}
                                    {(count - 1 - i) % every === 0 && (
                                        <text x={x + thickness / 2} y={height - 6} textAnchor="middle" className="fill-muted text-[11px]">{label}</text>
                                    )}
                                </g>
                            );
                        })}

                        <rect
                            x={MARGIN.left}
                            y={0}
                            width={plotWidth}
                            height={height - MARGIN.bottom}
                            fill="transparent"
                            onPointerDown={onPointer}
                            onPointerMove={onPointer}
                            onPointerLeave={() => setActive(null)}
                            onPointerCancel={() => setActive(null)}
                        />
                    </svg>
                )}

                {empty && emptyNote && width > 0 && (
                    <p className="pointer-events-none absolute inset-x-0 px-10 text-center text-xs text-muted" style={{ top: top + plotHeight / 2 - 8 }}>
                        {emptyNote}
                    </p>
                )}
                {active !== null && (
                    <Tooltip
                        title={titles[active]}
                        rows={[...series].reverse().map((s) => ({ label: s.label, value: s.values[active], color: s.color }))}
                        x={MARGIN.left + band * (active + 0.5)}
                        containerWidth={width}
                    />
                )}
            </div>
        </div>
    );
}
