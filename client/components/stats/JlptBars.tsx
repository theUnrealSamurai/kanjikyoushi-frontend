import type { JlptProgress } from "@/lib/types";
import { SERIES } from "./colors";
import { Legend, Swatch } from "./ChartParts";

const PARTS = [
    { key: "known", label: "Known at onboarding", color: SERIES.known },
    { key: "learned", label: "Learned in the app", color: SERIES.learned },
    { key: "remaining", label: "Remaining", color: SERIES.remaining },
] as const;

/** One horizontal stacked bar per JLPT level (N5 first): known at onboarding, learned in the app, remaining. The
 *  label on the right is "learned + known / total"; hover or focus a row for the three counts. */
export default function JlptBars({ levels }: { levels: JlptProgress[] }) {
    return (
        <div>
            <Legend series={PARTS.map(({ key, label, color }) => ({ key, label, color }))} kind="bar" />
            <ul className="space-y-3 pt-1">
                {levels.map((level) => {
                    const remaining = Math.max(0, level.total - level.known - level.learned);
                    const counts = { known: level.known, learned: level.learned, remaining };
                    const done = level.known + level.learned;
                    return (
                        <li
                            key={level.level}
                            tabIndex={0}
                            aria-label={`N${level.level}: ${done} of ${level.total} kanji. ${level.known} known at onboarding, ${level.learned} learned in the app, ${remaining} remaining.`}
                            className="group relative flex items-center gap-3 rounded-md"
                        >
                            <span className="w-7 shrink-0 text-sm font-semibold">N{level.level}</span>
                            <div className="flex h-3 min-w-0 flex-1 gap-0.5 overflow-hidden rounded-r-[4px]">
                                {PARTS.map((part) => counts[part.key] > 0 && (
                                    <div key={part.key} className="min-w-[2px]" style={{ flexGrow: counts[part.key], flexBasis: 0, backgroundColor: part.color }} />
                                ))}
                            </div>
                            <span className="w-20 shrink-0 text-right text-xs tabular-nums text-muted">{done} / {level.total}</span>

                            <div className="pointer-events-none invisible absolute bottom-full left-10 z-10 mb-1 whitespace-nowrap rounded-lg border border-border bg-surface-raised px-2.5 py-1.5 text-xs opacity-0 shadow-xl shadow-black/40 transition-opacity group-hover:visible group-hover:opacity-100 group-focus:visible group-focus:opacity-100">
                                {PARTS.map((part) => (
                                    <p key={part.key} className="flex items-center gap-1.5">
                                        <Swatch color={part.color} kind="bar" />
                                        <span className="font-semibold text-text">{counts[part.key]}</span>
                                        <span className="text-muted">{part.label.toLowerCase()}</span>
                                    </p>
                                ))}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
