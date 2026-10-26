"use client";

import { useState } from "react";

export interface TableData {
    columns: string[];
    rows: (string | number)[][];
}

interface Props {
    title: string;
    description: string;
    table: TableData;           // the same numbers as the chart, for the table view
    children: React.ReactNode;  // the chart
}

/** A `.panel` with a title, one line of description and a Chart/Table switch (the table is the accessible twin of the chart). */
export default function ChartCard({ title, description, table, children }: Props) {
    const [asTable, setAsTable] = useState(false);

    return (
        <section className="panel flex min-w-0 flex-col p-4">
            <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <h2 className="text-base font-semibold">{title}</h2>
                    <p className="text-xs text-muted">{description}</p>
                </div>
                <button
                    type="button"
                    aria-pressed={asTable}
                    onClick={() => setAsTable(!asTable)}
                    className={`shrink-0 rounded-md border px-2 py-1 text-xs font-semibold transition-colors ${asTable ? "border-accent bg-accent/15 text-accent" : "border-border text-muted hover:text-text"}`}
                >
                    Table
                </button>
            </div>

            {asTable ? (
                <div className="max-h-72 overflow-auto rounded-lg border border-border">
                    <table className="w-full text-left text-xs">
                        <thead className="sticky top-0 bg-surface-raised text-muted">
                            <tr>
                                {table.columns.map((column) => (
                                    <th key={column} scope="col" className="px-3 py-1.5 font-semibold">{column}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="tabular-nums">
                            {table.rows.map((row, i) => (
                                <tr key={i} className="border-t border-border/60">
                                    {row.map((cell, j) => (
                                        <td key={j} className="px-3 py-1">{cell}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                children
            )}
        </section>
    );
}
