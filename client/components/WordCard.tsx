import type { WordInfo } from "@/lib/types";

interface Props {
    word: WordInfo;
    role: "learning" | "review" | "known" | "unseen" | "kana" | "other";
}

const MAX_MEANINGS = 6;

const ROLE_STYLE = {
    learning: { edge: "border-l-new-word", badge: "bg-new-word/15 text-new-word", label: "new" },
    review: { edge: "border-l-review-word", badge: "bg-review-word/15 text-review-word", label: "review" },
    known: { edge: "border-l-accent", badge: "bg-accent/15 text-accent", label: "looked up" },
    unseen: { edge: "border-l-muted", badge: "bg-muted/15 text-muted", label: "not taught yet" },
    kana: { edge: "border-l-muted", badge: "bg-muted/15 text-muted", label: "meaning" },
    other: { edge: "border-l-muted", badge: "bg-muted/15 text-muted", label: "not graded" },
} as const;

/** Dictionary card for one word (new, review, a known word looked up with Tab, a kana word's meaning, or a name/number/counter): reading, numbered meanings and a compact kanji breakdown. */
export default function WordCard({ word, role }: Props) {
    const style = ROLE_STYLE[role];
    const meanings = word.meanings.slice(0, MAX_MEANINGS);
    const hidden = word.meanings.length - meanings.length;

    return (
        <article
            className={`w-full animate-card-in rounded-xl border border-l-4 border-border ${style.edge} bg-surface-raised p-3 shadow-lg shadow-black/30 motion-reduce:animate-none`}
            lang="ja"
        >
            <header className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <p className="break-words font-jp text-3xl font-bold leading-tight">{word.text}</p>
                    {word.reading && <p className="font-jp text-base text-muted">{word.reading}</p>}
                </div>
                <span className={`rounded-md px-2 py-0.5 font-sans text-[0.65rem] font-semibold uppercase tracking-wider ${style.badge}`}>
                    {style.label}
                </span>
            </header>

            <div lang="en" className="mt-2 font-sans text-sm">
                {meanings.length > 0 ? (
                    <ol className="list-decimal space-y-0.5 pl-5 marker:text-muted">
                        {meanings.map((meaning, i) => <li key={i}>{meaning}</li>)}
                    </ol>
                ) : (
                    <p className="italic text-muted">no dictionary entry</p>
                )}
                {hidden > 0 && <p className="mt-1 pl-5 text-xs text-muted">+{hidden} more</p>}
            </div>

            {word.kanji.length > 0 && (
                <ul className="mt-3 space-y-1.5 border-t border-border pt-2">
                    {word.kanji.map((item) => (
                        <li key={item.kanji} className="flex items-baseline gap-2.5">
                            <span className="w-6 shrink-0 text-center font-jp text-xl font-bold leading-none">{item.kanji}</span>
                            <span className="min-w-0 font-sans text-xs leading-snug text-muted">
                                {item.on_readings.length > 0 && <span className="mr-2"><b className="font-semibold text-text/80">on</b> <span lang="ja" className="font-jp">{item.on_readings.join("、")}</span></span>}
                                {item.kun_readings.length > 0 && <span className="mr-2"><b className="font-semibold text-text/80">kun</b> <span lang="ja" className="font-jp">{item.kun_readings.join("、")}</span></span>}
                                {item.meanings.length > 0 && <span lang="en">{item.meanings.join(", ")}</span>}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </article>
    );
}
