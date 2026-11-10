"use client";

import { useEffect, useMemo } from "react";
import type { Celebration as CelebrationItem } from "@/lib/types";

export const CELEBRATION_MS = 3000;

/** A cheeky line for each JLPT level you finish (the kanji of that level the app can teach are all covered). */
const LEVEL_QUIPS: Record<number, string> = {
    5: "Beginner? Not anymore.",
    4: "Getting dangerous.",
    3: "Now it gets real.",
    2: "Nearly there. Don't stop now.",
    1: "Final boss: defeated.",
};

/** Full class names so Tailwind sees them. */
const CONFETTI = ["bg-accent", "bg-new-word", "bg-review-word", "bg-success", "bg-grade-hard", "bg-danger"];
const PARTICLES = 22;

/** Dev preview: `?celebrate=level:5,kanji:250` becomes the celebrations to play on load. Never used in production. */
export const parsePreview = (query: string): CelebrationItem[] => {
    const items: CelebrationItem[] = [];
    for (const part of (new URLSearchParams(query).get("celebrate") ?? "").split(",")) {
        const [kind, value] = part.trim().split(":");
        const n = Number(value);
        if (kind === "level" && Number.isInteger(n) && n >= 1 && n <= 5) items.push({ kind: "level", level: n });
        else if (kind === "kanji" && Number.isInteger(n) && n > 0) items.push({ kind: "kanji", count: n });
    }
    return items;
};

/**
 * A small celebration in the practice area: a badge pops in at the top with a burst of confetti, then fades.
 * It never takes clicks or focus, and it times itself out (onDone) after CELEBRATION_MS. Levels come first, then
 * the kanji count. With reduced motion there is only a fade, no confetti. Remount it (change `key`) to replay.
 */
export default function Celebration({ items, onDone }: { items: CelebrationItem[]; onDone: () => void }) {
    useEffect(() => {
        const timer = setTimeout(onDone, CELEBRATION_MS);
        return () => clearTimeout(timer);
    }, [onDone]);

    // Fixed spread, so the burst looks the same on every render and needs no randomness.
    const particles = useMemo(() => Array.from({ length: PARTICLES }, (_, i) => {
        const angle = (i / PARTICLES) * Math.PI * 2 + (i % 3) * 0.21;
        const distance = 90 + ((i * 37) % 70);
        return {
            style: {
                "--dx": `${Math.round(Math.cos(angle) * distance * 1.5)}px`,
                "--dy": `${Math.round(Math.sin(angle) * distance - 20)}px`,
                "--rot": `${(i * 83) % 360}deg`,
                animationDelay: `${(i % 5) * 40}ms`,
            } as React.CSSProperties,
            className: `${CONFETTI[i % CONFETTI.length]} ${i % 2 ? "h-2 w-2 rounded-full" : "h-1.5 w-3 rounded-sm"}`,
        };
    }), []);

    if (items.length === 0) return null;
    return (
        <div
            role="status"
            data-testid="celebration"
            className="pointer-events-none fixed inset-x-0 top-20 z-50 flex select-none justify-center px-4"
        >
            <div className="relative">
                <div aria-hidden="true" className="absolute left-1/2 top-1/2 motion-reduce:hidden">
                    {particles.map((particle, i) => (
                        <span key={i} style={particle.style} className={`absolute animate-celebrate-burst ${particle.className}`} />
                    ))}
                </div>
                <div className="relative flex animate-celebrate-badge flex-col items-center gap-3 rounded-2xl border border-accent/60 bg-surface-raised px-8 py-4 text-center shadow-2xl shadow-black/50 ring-1 ring-accent/30 motion-reduce:animate-celebrate-fade">
                    {items.map((item) => item.kind === "level" ? (
                        <div key={`level-${item.level}`}>
                            <p className="font-sans text-5xl font-extrabold leading-none tracking-wide text-accent">N{item.level}</p>
                            <p className="mt-1 text-sm font-bold uppercase tracking-widest text-text">complete</p>
                            <p className="text-sm text-muted">{LEVEL_QUIPS[item.level]}</p>
                        </div>
                    ) : (
                        <div key={`kanji-${item.count}`}>
                            <p className="text-4xl font-extrabold leading-none text-new-word">
                                {item.count.toLocaleString("en-US")} <span lang="ja" className="font-jp">漢字</span>
                            </p>
                            <p className="mt-1 text-sm text-muted">learned here</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
