"use client";

import { KeyboardEvent, PointerEvent, useState } from "react";
import { Legend, Series, Tooltip } from "./ChartParts";
import { compact, labelEvery, nearestIndex, niceTicks } from "./scale";
import { useWidth } from "./useWidth";

interface Props {
    labels: string[];       // short axis label per point
    titles: string[];       // full name per point, for the tooltip
    series: Series[];       // all in the same unit, sharing one axis
    height: number;         // total height, including the axis labels
    ariaLabel: string;
    emptyNote?: string;     // shown over the empty plot when every value is zero
}

const MARGIN = { left: 32, right: 12, top: 10, bottom: 22 };

/** Multi-series line chart in plain SVG on one shared axis: 2px lines, an end dot per series, and a crosshair that
 *  snaps to the nearest day with one tooltip listing every series. */
export default function LineChart({ labels, titles, series, height, ariaLabel, emptyNote }: Props) {
    const [ref, width] = useWidth<HTMLDivElement>();
    const [active, setActive] = useState<number | null>(null);

    const count = labels.length;
    const plotWidth = Math.max(0, width - MARGIN.left - MARGIN.right);
    const plotHeight = height - MARGIN.top - MARGIN.bottom;
    const step = count > 1 ? plotWidth / (count - 1) : 0;
    const x = (i: number) => MARGIN.left + (count > 1 ? i * step : plotWidth / 2);

    const ticks = niceTicks(Math.max(0, ...series.flatMap((s) => s.values)));
    const ceiling = ticks[ticks.length - 1];
    const y = (value: number) => MARGIN.top + plotHeight - (value / ceiling) * plotHeight;
    const every = labelEvery(step);
    const empty = series.every((s) => s.values.every((v) => v === 0));

    const onPointer = (e: PointerEvent<SVGRectElement>) => {
        const box = e.currentTarget.getBoundingClientRect();
        setActive(nearestIndex(e.clientX - box.left, step, count));
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
            <Legend series={series} kind="line" />
            <div ref={ref} className="relative" style={{ height }}>
                {width > 0 && (
                    <svg
                        width={width}
                        height={height}
                        role="group"
                        aria-label={`${ariaLabel}. Arrow keys move between days; the Table button lists every value.`}
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

                        {labels.map((label, i) => (count - 1 - i) % every === 0 && (
                            <text key={i} x={x(i)} y={height - 6} textAnchor="middle" className="fill-muted text-[11px]">{label}</text>
                        ))}

                        {active !== null && (
                            <line x1={x(active)} x2={x(active)} y1={MARGIN.top} y2={y(0)} className="stroke-border" strokeWidth={1} />
                        )}

                        {series.map((s) => (
                            <g key={s.key}>
                                <path
                                    d={s.values.map((v, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(v)}`).join("")}
                                    fill="none"
                                    stroke={s.color}
                                    strokeWidth={2}
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                />
                                {count > 0 && <circle cx={x(active ?? count - 1)} cy={y(s.values[active ?? count - 1])} r={4} fill={s.color} className="stroke-surface" strokeWidth={2} />}
                            </g>
                        ))}

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
                    <p className="pointer-events-none absolute inset-x-0 px-10 text-center text-xs text-muted" style={{ top: MARGIN.top + plotHeight / 2 - 8 }}>
                        {emptyNote}
                    </p>
                )}
                {active !== null && (
                    <Tooltip
                        title={titles[active]}
                        rows={series.map((s) => ({ label: s.label, value: s.values[active], color: s.color }))}
                        x={x(active)}
                        containerWidth={width}
                    />
                )}
            </div>
        </div>
    );
}
