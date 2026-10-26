interface Props {
    learnNew: boolean;
    busy: boolean;
    onChange: (learnNew: boolean) => void;
}

/** Learn / Review switch: on teaches new words (reviews mixed in), off shows only the words that are due. */
export default function ModeSwitch({ learnNew, busy, onChange }: Props) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={learnNew}
            disabled={busy}
            title={learnNew ? "New words are mixed in with your reviews" : "Review only: just the words that are due"}
            onClick={() => onChange(!learnNew)}
            // Keep focus in the typing input: pressing the switch must not blur it.
            onMouseDown={(e) => e.preventDefault()}
            className="flex items-center gap-2 rounded-lg py-1 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60"
        >
            <span className={learnNew ? "text-text" : "text-muted"}>Learn new words</span>
            <span
                aria-hidden
                className={`relative h-5 w-9 shrink-0 rounded-full border transition-colors ${learnNew ? "border-accent bg-accent" : "border-border bg-surface-raised"}`}
            >
                <span
                    className={`absolute top-0.5 h-3.5 w-3.5 rounded-full transition-all motion-reduce:transition-none ${learnNew ? "left-[1.1rem] bg-accent-fg" : "left-0.5 bg-muted"}`}
                />
            </span>
        </button>
    );
}
