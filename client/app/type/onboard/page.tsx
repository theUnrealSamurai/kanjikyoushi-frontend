"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import kanjiData from "@/json/kanjiList.json";
import { errorMessage, post } from "@/lib/api";

type KanjiData = {
    [level: string]: string[][];
};

const kanjiJson: KanjiData = kanjiData;
const LEVELS = ["N5", "N4", "N3", "N2", "N1", "N1+"];
const COLLAPSED_BY_DEFAULT = new Set(["N1+"]);

/** Select every kanji in `group`, or clear them all when they are already all selected. */
function toggleGroup(selected: Set<string>, group: string[]): Set<string> {
    const next = new Set(selected);
    if (group.every((kanji) => next.has(kanji))) group.forEach((kanji) => next.delete(kanji));
    else group.forEach((kanji) => next.add(kanji));
    return next;
}

function Checkbox({ checked, indeterminate, onChange, label }: { checked: boolean; indeterminate?: boolean; onChange: () => void; label: string }) {
    return (
        <input
            type="checkbox"
            aria-label={label}
            className="h-4 w-4 shrink-0 cursor-pointer accent-accent"
            checked={checked}
            ref={(el) => {
                if (el) el.indeterminate = Boolean(indeterminate) && !checked;
            }}
            onChange={onChange}
            onClick={(e) => e.stopPropagation()}
        />
    );
}

export default function Onboard() {
    const router = useRouter();
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [collapsed, setCollapsed] = useState<Set<string>>(new Set(COLLAPSED_BY_DEFAULT));
    const [submitting, setSubmitting] = useState(false);

    const levelKanji = useMemo(
        () => Object.fromEntries(LEVELS.map((level) => [level, kanjiJson[level].flat()])) as Record<string, string[]>,
        [],
    );

    const toggleKanji = (kanji: string) => setSelected(toggleGroup(selected, [kanji]));
    const toggleCollapsed = (level: string) => {
        const next = new Set(collapsed);
        if (!next.delete(level)) next.add(level);
        setCollapsed(next);
    };

    const handleSubmit = async () => {
        if (submitting) return;
        setSubmitting(true);
        try {
            const response = await post("/type/onboard", { kanji_list: Array.from(selected).join("") });
            if (response.ok) {
                router.push("/type/practice");
                return;
            }
            const data = await response.json().catch(() => null);
            toast.error(errorMessage(data, "Something didn't go right. Please try again."));
        } catch {
            toast.error("Couldn't reach the server. Please try again.");
        }
        setSubmitting(false);
    };

    return (
        <div className="flex min-h-full flex-col">
            <div className="mx-auto w-full max-w-4xl flex-1 px-4 pb-8 pt-8">
                <h1 className="text-2xl font-bold sm:text-3xl">What kanji do you already know?</h1>
                <p className="mt-2 text-muted">
                    Pick everything you can already read. Words written only with these kanji are skipped, so you spend your time on new ones.
                </p>
                <div className="mt-4 flex gap-3 rounded-xl border border-new-word/40 bg-new-word/10 p-3 text-sm" role="note">
                    <span aria-hidden className="font-bold text-new-word">!</span>
                    <p>Saving this starts your progress <strong>from scratch</strong>. Any words you have already learned are reset.</p>
                </div>

                <div className="mt-6 space-y-3">
                    {LEVELS.map((level) => {
                        const all = levelKanji[level];
                        const count = all.filter((kanji) => selected.has(kanji)).length;
                        const open = !collapsed.has(level);
                        return (
                            <section key={level} className="panel overflow-hidden">
                                <div
                                    className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-surface-raised"
                                    onClick={() => toggleCollapsed(level)}
                                >
                                    <Checkbox
                                        label={`Select all ${level} kanji`}
                                        checked={count === all.length}
                                        indeterminate={count > 0}
                                        onChange={() => setSelected(toggleGroup(selected, all))}
                                    />
                                    <h2 className="text-xl font-bold text-accent">{level}</h2>
                                    <span className="text-sm text-muted">{count} / {all.length}</span>
                                    <button
                                        type="button"
                                        className="ml-auto rounded-md px-2 py-1 text-sm text-muted hover:text-text"
                                        aria-expanded={open}
                                        aria-label={`${open ? "Collapse" : "Expand"} ${level}`}
                                    >
                                        <span aria-hidden className={`inline-block transition-transform ${open ? "rotate-90" : ""}`}>▶</span>
                                    </button>
                                </div>
                                {open && (
                                    <div className="space-y-4 border-t border-border p-4">
                                        {kanjiJson[level].map((list, listIndex) => {
                                            const listCount = list.filter((kanji) => selected.has(kanji)).length;
                                            return (
                                                <div key={listIndex} className="flex gap-3">
                                                    <div className="pt-2">
                                                        <Checkbox
                                                            label={`Select ${level} group ${listIndex + 1}`}
                                                            checked={listCount === list.length}
                                                            indeterminate={listCount > 0}
                                                            onChange={() => setSelected(toggleGroup(selected, list))}
                                                        />
                                                    </div>
                                                    <div className="flex flex-wrap gap-1.5" lang="ja">
                                                        {list.map((kanji) => (
                                                            <button
                                                                type="button"
                                                                key={kanji}
                                                                aria-pressed={selected.has(kanji)}
                                                                onClick={() => toggleKanji(kanji)}
                                                                className={`h-11 w-11 rounded-lg border font-jp text-xl font-bold transition-colors ${selected.has(kanji)
                                                                    ? "border-accent bg-accent/20 text-text"
                                                                    : "border-border bg-surface-raised text-muted hover:border-accent/60 hover:text-text"}`}
                                                            >
                                                                {kanji}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </section>
                        );
                    })}
                </div>
            </div>

            <div className="sticky bottom-0 z-10 border-t border-border bg-background/90 backdrop-blur">
                <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-3">
                    <p className="text-sm">
                        <span className="text-lg font-bold text-accent">{selected.size}</span>{" "}
                        <span className="text-muted">kanji selected</span>
                    </p>
                    {selected.size > 0 && !submitting && (
                        <button type="button" className="text-sm text-muted underline hover:text-text" onClick={() => setSelected(new Set())}>
                            Clear
                        </button>
                    )}
                    <button type="button" className="btn-primary ml-auto" onClick={handleSubmit} disabled={submitting}>
                        {submitting ? "Saving…" : "Continue"}
                    </button>
                </div>
            </div>
        </div>
    );
}
