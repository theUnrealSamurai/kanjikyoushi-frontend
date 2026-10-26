"use client";

import { useEffect, useRef, useState } from "react";
import { plural } from "@/lib/plural";
import type { Stats } from "@/lib/types";

interface Props {
    stats: Stats;
    busy: boolean;            // a learn/review switch request is in flight
    onReview: () => void;     // switch to review mode
}

/** The ⓘ button next to the learn switch, shown only while something is due. It opens a short nudge to clear
 *  the due words before learning more; the list of what's due is in the side panel (DuePanel). */
export default function DueInfo({ stats, busy, onReview }: Props) {
    const wrapper = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);

    // Escape and a press outside close it. Pointer events cover mouse and touch alike.
    useEffect(() => {
        if (!open) return;
        const onKey = (e: globalThis.KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        const onPointer = (e: PointerEvent) => {
            if (!wrapper.current?.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("keydown", onKey);
        document.addEventListener("pointerdown", onPointer);
        return () => {
            document.removeEventListener("keydown", onKey);
            document.removeEventListener("pointerdown", onPointer);
        };
    }, [open]);

    const run = (action: () => void) => () => {
        setOpen(false);
        action();
    };

    return (
        // Keep focus in the typing input: pressing the button or the popover must not blur it.
        <div ref={wrapper} className="relative" onMouseDown={(e) => e.preventDefault()}>
            <button
                type="button"
                aria-label={`${plural(stats.due, "word")} due`}
                aria-haspopup="dialog"
                aria-expanded={open}
                aria-controls="due-info"
                onClick={() => setOpen(!open)}
                className={`relative flex h-8 w-8 items-center justify-center rounded-full border transition-colors hover:text-review-word ${open ? "border-review-word bg-review-word/15 text-review-word" : "border-review-word/50 bg-surface text-review-word/80"}`}
            >
                <span aria-hidden className="font-serif text-base font-bold italic leading-none">i</span>
                <span aria-hidden className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-review-word ring-2 ring-background" />
            </button>

            {open && (
                <div
                    id="due-info"
                    role="dialog"
                    aria-label="Words due"
                    className="absolute right-0 top-full z-20 mt-2 w-[min(22rem,calc(100vw-2rem))] animate-fade-in rounded-lg border border-review-word/30 bg-surface text-left shadow-2xl shadow-black/50"
                >
                    <div className="space-y-3 rounded-lg bg-review-word/10 px-4 py-3 text-sm">
                        <p>
                            {plural(stats.due, "word")} due ({plural(stats.due_kanji, "kanji", "kanji")}).{" "}
                            {stats.learn_new ? "Finish them before learning more." : "Review mode is on, so only these come up."}
                        </p>
                        {stats.learn_new && (
                            <button
                                type="button"
                                disabled={busy}
                                onClick={run(onReview)}
                                className="rounded-md bg-review-word/20 px-2.5 py-1 text-xs font-semibold text-review-word transition-colors hover:bg-review-word/30 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Review now
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
