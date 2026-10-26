interface Props {
    label: string;
    value: string | number;
    note?: string;
}

/** One headline number with a label above and a short note below. */
export default function StatTile({ label, value, note }: Props) {
    return (
        <div className="panel min-w-0 px-4 py-3">
            <p className="text-xs text-muted">{label}</p>
            <p className="mt-1 text-3xl font-semibold leading-tight">{value}</p>
            {note && <p className="mt-0.5 text-xs text-muted">{note}</p>}
        </div>
    );
}
