interface Props {
    label: string;
    checked: boolean;
    busy: boolean;
    onChange: (checked: boolean) => void;
    title?: string;
    disabled?: boolean;  // locked: shown off and not clickable
    note?: string;       // small muted text after the switch, e.g. the progress toward unlocking it
}

/** A labelled on/off switch for the practice header (Learn new words, Paragraphs). */
export default function ModeSwitch({ label, checked, busy, onChange, title, disabled = false, note }: Props) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={busy || disabled}
            title={title}
            onClick={() => onChange(!checked)}
            // Keep focus in the typing input: pressing the switch must not blur it.
            onMouseDown={(e) => e.preventDefault()}
            className="flex items-center gap-2 whitespace-nowrap rounded-lg py-1 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60"
        >
            <span className={checked ? "text-text" : "text-muted"}>{label}</span>
            <span
                aria-hidden
                className={`relative h-5 w-9 shrink-0 rounded-full border transition-colors ${checked ? "border-accent bg-accent" : "border-border bg-surface-raised"}`}
            >
                <span
                    className={`absolute top-0.5 h-3.5 w-3.5 rounded-full transition-all motion-reduce:transition-none ${checked ? "left-[1.1rem] bg-accent-fg" : "left-0.5 bg-muted"}`}
                />
            </span>
            {note && <span className="text-xs font-medium text-muted">{note}</span>}
        </button>
    );
}
