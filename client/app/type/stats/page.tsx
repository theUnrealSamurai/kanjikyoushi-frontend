"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ChartCard from "@/components/stats/ChartCard";
import BarChart from "@/components/stats/BarChart";
import LineChart from "@/components/stats/LineChart";
import JlptBars from "@/components/stats/JlptBars";
import StatTile from "@/components/stats/StatTile";
import { SERIES } from "@/components/stats/colors";
import { fullDate, longDate, shortDate } from "@/components/stats/scale";
import { errorMessage, post } from "@/lib/api";
import { plural } from "@/lib/plural";
import type { StatsReport } from "@/lib/types";

const RANGES = [30, 90] as const;

interface Result {
    key: string;                 // the request this answers: "<days>:<retry count>"
    report: StatsReport | null;  // the last good report, kept on screen (dimmed) while the next one loads
    error: string | null;
}

/** Your stats: headline tiles and charts for the last 30 or 90 days. */
export default function Stats() {
    const router = useRouter();
    const [days, setDays] = useState<(typeof RANGES)[number]>(30);
    const [attempt, setAttempt] = useState(0);
    const [result, setResult] = useState<Result>({ key: "", report: null, error: null });

    const key = `${days}:${attempt}`;
    const loading = result.key !== key;

    useEffect(() => {
        let cancelled = false;
        (async () => {
            let report: StatsReport | null = null;
            let error: string | null = null;
            try {
                const response = await post("/type/stats", { days });
                if (cancelled) return;
                if (response.status === 409) {
                    router.push("/type/onboard");
                    return;
                }
                const data = await response.json().catch(() => null);
                if (response.ok && data) report = data;
                else error = errorMessage(data, "Couldn't load your stats.");
            } catch {
                error = "Couldn't reach the server.";
            }
            if (!cancelled) setResult((previous) => ({ key, report: report ?? previous.report, error }));
        })();
        return () => {
            cancelled = true;
        };
    }, [days, key, router]);

    const { report, error } = result;

    return (
        <div className="mx-auto w-full max-w-5xl px-4 pb-8 pt-5">
            <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold">Your stats</h1>
                    {report && (
                        <p className="text-sm text-muted">
                            {report.tracking_since
                                ? `Tracking since ${fullDate(report.tracking_since)}. Earlier history isn't recorded.`
                                : "Tracking starts with your next sentence. Earlier history isn't recorded."}
                        </p>
                    )}
                </div>
                <div role="group" aria-label="Time range" className="flex rounded-xl border border-border bg-surface p-1 text-sm font-semibold">
                    {RANGES.map((range) => (
                        <button
                            key={range}
                            type="button"
                            aria-pressed={days === range}
                            onClick={() => setDays(range)}
                            className={`rounded-lg px-3 py-1 transition-colors ${days === range ? "bg-accent/15 text-accent" : "text-muted hover:text-text"}`}
                        >
                            {range} days
                        </button>
                    ))}
                </div>
            </header>

            {error && !loading ? (
                <div role="alert" className="panel flex flex-col items-start gap-3 p-4">
                    <p className="text-danger">{error}</p>
                    <button type="button" onClick={() => setAttempt(attempt + 1)} className="btn-ghost">Retry</button>
                </div>
            ) : report ? (
                <div className={`transition-opacity ${loading ? "opacity-60" : ""}`} aria-busy={loading}>
                    <Dashboard report={report} />
                </div>
            ) : (
                <p className="py-16 text-center text-muted">Loading your stats…</p>
            )}
        </div>
    );
}

/** Tiles and charts for one report. */
function Dashboard({ report }: { report: StatsReport }) {
    const { totals, today, days, forecast, jlpt } = report;

    const short = useMemo(() => days.map((day) => shortDate(day.date)), [days]);
    const long = useMemo(() => days.map((day) => longDate(day.date)), [days]);
    const column = (pick: (day: StatsReport["days"][number]) => number) => days.map(pick);
    const dayRows = (...picks: ((day: StatsReport["days"][number]) => number)[]) =>
        days.map((day) => [longDate(day.date), ...picks.map((pick) => pick(day))]);

    const forecastLabels = forecast.map((item, i) => (i === 0 ? "Today" : shortDate(item.date)));
    const forecastTitles = forecast.map((item, i) => (i === 0 ? "Today (and overdue)" : longDate(item.date)));

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <StatTile label="Kanji learned" value={totals.kanji} note={`+ ${totals.known_kanji} known before`} />
                <StatTile label="Words learned" value={totals.words} note={totals.learning > 0 ? `${totals.learning} still warming up` : undefined} />
                <StatTile
                    label="Today"
                    value={today.words}
                    note={`new ${today.words === 1 ? "word" : "words"} · ${plural(today.reviews, "review")} · ${plural(today.sentences, "sentence")}`}
                />
                <StatTile label="Day streak" value={totals.streak} note={totals.streak > 0 ? "days in a row" : "type a sentence to start one"} />
                <StatTile
                    label="Retention"
                    value={totals.retention === null ? "—" : `${Math.round(totals.retention * 100)}%`}
                    note={`reviews without help, last ${days.length} days`}
                />
                <StatTile label="Due now" value={totals.due} note={totals.due === 1 ? "word to review" : "words to review"} />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <ChartCard
                    title="New words and kanji per day"
                    description="Words that finished their warm-up, and kanji met for the first time in them."
                    table={{ columns: ["Date", "New words", "New kanji"], rows: dayRows((d) => d.words, (d) => d.kanji) }}
                >
                    <div className="space-y-3">
                        <BarChart
                            labels={short}
                            titles={long}
                            series={[{ key: "words", label: "New words", color: SERIES.words, values: column((d) => d.words) }]}
                            legend
                            height={120}
                            ariaLabel="New words learned per day"
                            emptyNote="No new words yet. Finish a word's warm-up and it lands here."
                        />
                        <BarChart
                            labels={short}
                            titles={long}
                            series={[{ key: "kanji", label: "New kanji", color: SERIES.kanji, values: column((d) => d.kanji) }]}
                            legend
                            height={120}
                            ariaLabel="New kanji learned per day"
                            emptyNote="New kanji will show up here as your words come in."
                        />
                    </div>
                </ChartCard>

                <ChartCard
                    title="Total learned over time"
                    description="Running totals of words and kanji at the end of each day."
                    table={{ columns: ["Date", "Words", "Kanji"], rows: dayRows((d) => d.total_words, (d) => d.total_kanji) }}
                >
                    <LineChart
                        labels={short}
                        titles={long}
                        series={[
                            { key: "words", label: "Words", color: SERIES.words, values: column((d) => d.total_words) },
                            { key: "kanji", label: "Kanji", color: SERIES.kanji, values: column((d) => d.total_kanji) },
                        ]}
                        height={256}
                        ariaLabel="Total words and kanji learned by day"
                        emptyNote="Your totals start climbing with your first learned word."
                    />
                </ChartCard>

                <ChartCard
                    title="Reviews per day"
                    description="Reviews of learned words, by whether you needed the reading shown."
                    table={{ columns: ["Date", "Without help", "Needed the reading"], rows: dayRows((d) => d.reviews - d.hard, (d) => d.hard) }}
                >
                    <BarChart
                        labels={short}
                        titles={long}
                        series={[
                            { key: "easy", label: "Without help", color: SERIES.easy, values: column((d) => d.reviews - d.hard) },
                            { key: "hard", label: "Needed the reading", color: SERIES.hard, values: column((d) => d.hard) },
                        ]}
                        height={220}
                        ariaLabel="Reviews per day, without help and needing the reading"
                        emptyNote="Reviews appear once your first words come back."
                    />
                </ChartCard>

                <ChartCard
                    title="Sentences typed per day"
                    description="Every sentence you finished."
                    table={{ columns: ["Date", "Sentences"], rows: dayRows((d) => d.sentences) }}
                >
                    <BarChart
                        labels={short}
                        titles={long}
                        series={[{ key: "sentences", label: "Sentences", color: SERIES.sentences, values: column((d) => d.sentences) }]}
                        height={220}
                        ariaLabel="Sentences typed per day"
                        emptyNote="Type a sentence to put the first bar here."
                    />
                </ChartCard>

                <ChartCard
                    title="Upcoming reviews"
                    description="Words due in each of the next 7 days. Today includes anything overdue."
                    table={{ columns: ["Day", "Words due"], rows: forecast.map((item, i) => [forecastTitles[i], item.due]) }}
                >
                    <BarChart
                        labels={forecastLabels}
                        titles={forecastTitles}
                        series={[{ key: "due", label: "Words due", color: SERIES.due, values: forecast.map((item) => item.due) }]}
                        height={220}
                        valueLabels
                        ariaLabel="Words due in each of the next 7 days"
                        emptyNote="Nothing due this week. Time to learn something new."
                    />
                </ChartCard>

                <ChartCard
                    title="JLPT kanji progress"
                    description="Kanji you already knew, kanji learned here, and what's left, per level."
                    table={{
                        columns: ["Level", "Known at onboarding", "Learned in the app", "Remaining", "Total"],
                        rows: jlpt.map((level) => [`N${level.level}`, level.known, level.learned, Math.max(0, level.total - level.known - level.learned), level.total]),
                    }}
                >
                    <JlptBars levels={jlpt} />
                </ChartCard>
            </div>
        </div>
    );
}
