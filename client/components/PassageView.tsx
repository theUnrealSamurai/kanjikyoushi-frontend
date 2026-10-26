"use client";

import { ReactNode, useEffect, useRef } from "react";
import { ROLE_BORDER, ROLE_COLOR } from "@/lib/roles";
import type { PassageView as Passage, Token } from "@/lib/types";

interface Props {
    passage: Passage;
    current: ReactNode;  // the line being typed, already rendered by the page (progress, errors, Tab reveals)
}

/** A line that isn't being typed: role colours and furigana per role, with no Tab or help state.
 *  Review and known words keep their reading hidden (the space stays, so the line doesn't shift later). */
function staticToken(token: Token, key: number) {
    const hidden = token.role === "review" || token.role === "known";
    return (
        <span key={key} className={ROLE_COLOR[token.role ?? ""] ?? "text-text"}>
            {token.ruby.map(([base, reading], i) => {
                const letters = <span className={ROLE_BORDER[token.role ?? ""] ?? ""}>{base}</span>;
                if (!reading) return <span key={i}>{letters}</span>;
                return (
                    <ruby key={i}>
                        {letters}
                        <rt className={`text-[0.42em] font-medium tracking-normal ${hidden ? "invisible" : ""}`}>{reading}</rt>
                    </ruby>
                );
            })}
        </span>
    );
}

/** Paragraph mode: the whole passage as flowing text. Lines already typed are dimmed with a tick, the current line
 *  is highlighted and interactive (rendered by the page), lines to come are dimmed and not interactive. */
export default function PassageView({ passage, current }: Props) {
    const box = useRef<HTMLDivElement>(null);
    const currentLine = useRef<HTMLSpanElement>(null);
    const { index, lines } = passage;

    // Keep the current line in view on a long passage. Only the passage box scrolls, never the page.
    useEffect(() => {
        const container = box.current;
        const line = currentLine.current;
        if (!container || !line) return;
        const offset = line.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop;
        const top = offset - (container.clientHeight - line.getBoundingClientRect().height) / 2;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        container.scrollTo({ top: Math.max(0, top), behavior: reduced ? "auto" : "smooth" });
    }, [passage.id, index]);

    // "<title>, <author> · <source> · <licence>", leaving out whatever is empty.
    const byline = [passage.source, passage.licence].filter(Boolean);

    return (
        <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                Sentence {index + 1} / {lines.length}
            </p>

            <div ref={box} className="relative max-h-[45vh] overflow-y-auto overscroll-contain py-1">
                <p className="break-words font-jp text-xl font-medium leading-[2.5] tracking-wide sm:text-2xl sm:leading-[2.5]" lang="ja">
                    {lines.map((line, i) => {
                        if (i < index) {
                            return (
                                <span key={i} className="opacity-40">
                                    {line.tokens.map(staticToken)}
                                    <span aria-hidden className="mx-1 align-middle font-sans text-sm text-success">✓</span>
                                    <span className="sr-only">(done)</span>
                                </span>
                            );
                        }
                        if (i === index) {
                            return (
                                <span
                                    key={i}
                                    ref={currentLine}
                                    aria-current="true"
                                    className="rounded-md bg-accent/10 px-1.5 py-1 text-2xl box-decoration-clone sm:text-3xl"
                                >
                                    {current}
                                </span>
                            );
                        }
                        return (
                            <span key={i} className="mx-0.5 opacity-[0.55]">
                                {line.tokens.map(staticToken)}
                            </span>
                        );
                    })}
                </p>
            </div>

            <p className="text-xs text-muted">
                {passage.url ? (
                    <a href={passage.url} target="_blank" rel="noopener noreferrer" className="underline decoration-muted/50 underline-offset-2 hover:text-text">
                        {passage.title}
                    </a>
                ) : (
                    passage.title
                )}
                {passage.author && `, ${passage.author}`}
                {byline.map((part) => ` · ${part}`)}
            </p>
        </div>
    );
}
