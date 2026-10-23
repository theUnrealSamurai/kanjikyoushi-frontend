import Link from "next/link";
import NavBar from "@/components/NavBar";
import homeLines from "@/json/homeLines.json";

// Render per request so every visit gets a different demo line.
export const dynamic = "force-dynamic";

type Word = { word: string; reading: string; kind: "new" | "review" };
type LinePart = string | Word;
const LINES = homeLines as LinePart[][];

const REPO = "https://github.com/theUnrealSamurai/kanjikyoushi-frontend";
const PROFILE = "https://github.com/theUnrealSamurai";

const WORD_STYLE = {
    new: "border-b-2 border-new-word text-new-word",
    review: "border-b-2 border-review-word text-review-word",
};

const STEPS = [
    {
        title: "New words come with furigana",
        body: "Meeting a word for the first time? It's in amber with the reading on top, so you can type it while you get to know it.",
        tone: "text-new-word",
        visual: (
            <span className={`font-jp text-4xl font-medium ${WORD_STYLE.new}`} lang="ja">
                <ruby>先生<rt className="text-[0.42em]">せんせい</rt></ruby>
            </span>
        ),
    },
    {
        title: "Learned words come back bare",
        body: "Words you've learned return with the furigana hidden. Typing them is the review, so there are no flashcards to rate.",
        tone: "text-review-word",
        visual: (
            <span className={`font-jp text-4xl font-medium ${WORD_STYLE.review}`} lang="ja">
                <ruby>会議<rt className="invisible text-[0.42em]">かいぎ</rt></ruby>
            </span>
        ),
    },
    {
        title: "Stuck? Press Tab",
        body: "Tab shows the reading of the word you're on and opens its dictionary card. Shift+Tab shows every reading, the romaji and an English translation.",
        tone: "text-accent",
        visual: (
            <kbd className="rounded-lg border border-b-4 border-border bg-surface-raised px-5 py-2 font-sans text-xl font-semibold text-text">
                Tab
            </kbd>
        ),
    },
];

export default function Home() {
    // eslint-disable-next-line react-hooks/purity -- rendered per request; a different line each visit is the point
    const line = LINES[Math.floor(Math.random() * LINES.length)];
    return (
        <div className="flex min-h-screen flex-col">
            <NavBar />

            <section className="relative isolate overflow-hidden">
                <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[28rem] w-[56rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-accent/15 blur-3xl" />
                <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-12 pt-14 sm:pt-20 lg:grid-cols-[1fr_1.15fr] lg:pb-16">
                    <div>
                        <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-muted">
                            <span className="h-1.5 w-1.5 rounded-full bg-success" />
                            Free · No ads · No AI
                        </p>
                        <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
                            Speak Japanese,
                            <br />
                            <span className="text-accent">can&apos;t read kanji?</span>
                        </h1>
                        <p className="mt-6 max-w-xl text-lg text-muted">
                            Same here. I made this to fix exactly that. You type real Japanese sentences, and the
                            kanji sink in while you do.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link href="/type/practice" className="btn-primary px-6 py-3 text-base">Start typing →</Link>
                            <a href="#how" className="btn-ghost px-6 py-3 text-base">How it works</a>
                        </div>
                    </div>
                    <TypingDemo line={line} />
                </div>
            </section>

            <section id="how" className="mx-auto w-full max-w-6xl scroll-mt-8 px-5 pb-20 pt-12 sm:pb-24 sm:pt-16">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">How it works</p>
                <h2 className="mt-3 max-w-2xl text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                    Learn by typing. Remember with spaced repetition.
                </h2>
                <p className="mt-4 max-w-2xl text-lg text-muted">
                    Sentences are fed to you in a way that keeps what you&apos;ve learned fresh while you pick up
                    more. Dictionary, translation, romaji: everything you&apos;d need is right there.
                </p>
                <ol className="mt-12 grid gap-4 md:grid-cols-3">
                    {STEPS.map((step, i) => (
                        <li key={step.title} className="panel flex flex-col p-5">
                            <div aria-hidden className="flex h-32 items-center justify-center rounded-xl border border-border bg-background/60">
                                {step.visual}
                            </div>
                            <span className={`mt-5 text-sm font-bold ${step.tone}`}>0{i + 1}</span>
                            <h3 className="mt-1 text-lg font-semibold">{step.title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
                        </li>
                    ))}
                </ol>
            </section>

            <section className="border-y border-border bg-surface/60">
                <div className="mx-auto max-w-6xl px-5 py-20 text-center sm:py-28">
                    <h2 className="text-5xl font-black uppercase leading-[0.95] tracking-tighter sm:text-7xl lg:text-8xl">
                        No fuckin&apos;{" "}
                        <span className="text-danger line-through decoration-text decoration-[0.08em]">AI</span>
                        <br />
                        anywhere.
                    </h2>
                    <p className="mx-auto mt-8 max-w-xl text-lg text-muted">
                        Good old fuckin&apos; logic. Everything here is deterministic: same input, same result,
                        every time.
                    </p>
                    <a href={PROFILE} target="_blank" rel="noreferrer" className="mt-6 inline-block font-semibold text-accent hover:underline">
                        Go check my GitHub to see how it works →
                    </a>
                </div>
            </section>

            <section className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-20 sm:py-24 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Why does this exist?</p>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">idk man. It&apos;s a niche thing.</h2>
                </div>
                <div className="space-y-5 text-lg leading-relaxed text-muted">
                    <p>
                        Very specific to my use case. I have a typing habit (Monkeytype and TypeRacer), and I
                        learnt Japanese from anime. The only things I didn&apos;t know were some vocabulary and
                        the kanji, so I made this to learn them.
                    </p>
                    <p>
                        If you find it useful, leave a star on GitHub and fuckin&apos; use it. It&apos;s fuckin&apos;
                        free and I don&apos;t serve you fuckin&apos; ads.
                    </p>
                    <p>Want features or some shit like that? Ask me, I&apos;ll consider.</p>
                    <div className="flex flex-wrap gap-3 pt-2">
                        <a href={REPO} target="_blank" rel="noreferrer" className="btn-primary">★ Star on GitHub</a>
                        <a href={`${REPO}/issues`} target="_blank" rel="noreferrer" className="btn-ghost">Request a feature</a>
                    </div>
                </div>
            </section>

            <section className="mx-auto w-full max-w-6xl px-5 pb-20">
                <div className="panel relative isolate overflow-hidden px-6 py-14 text-center sm:py-20">
                    <div aria-hidden className="pointer-events-none absolute -bottom-24 left-1/2 -z-10 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-accent/15 blur-3xl" />
                    <p className="font-jp text-muted" lang="ja">とにかく打て。</p>
                    <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">
                        Forget everything.
                        <br />
                        Just keep typing.
                    </h2>
                    <p className="mt-4 text-lg text-muted">You&apos;ll eventually know all the kanji.</p>
                    <Link href="/type/practice" className="btn-primary mt-8 px-8 py-3 text-lg">Start typing →</Link>
                </div>
            </section>

            <footer className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6 text-sm text-muted">
                <a href={REPO} target="_blank" rel="noreferrer" className="hover:text-accent">GitHub</a>
                <p>© {new Date().getFullYear()} Type Kanji</p>
            </footer>
        </div>
    );
}

/** A still of the practice screen: everything up to the end of the first highlighted word is "typed". */
function TypingDemo({ line }: { line: LinePart[] }) {
    const text = (part: LinePart) => (typeof part === "string" ? part : part.word);
    const typed = line.slice(0, line.findIndex((part) => typeof part !== "string") + 1).map(text).join("");
    const typedLength = Array.from(typed).length;

    let offset = 0;
    const letters = (s: string) =>
        Array.from(s).map((letter) => {
            const index = offset++;
            return <span key={index} className={index < typedLength ? undefined : "opacity-60"}>{letter}</span>;
        });

    return (
        <div aria-hidden className="panel shadow-2xl shadow-black/40">
            <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3 text-xs text-muted sm:px-7">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-new-word" />new word</span>
                    <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-review-word" />review</span>
                </div>
                <span>↻ refresh for another</span>
            </div>
            <div className="flex flex-col gap-5 p-5 sm:p-7">
                <p className="break-words font-jp text-2xl font-medium leading-[2.4] tracking-wide sm:text-4xl sm:leading-[2.4]" lang="ja">
                    {line.map((part, i) =>
                        typeof part === "string" ? (
                            <span key={i}>{letters(part)}</span>
                        ) : (
                            <span key={i} className={WORD_STYLE[part.kind]}>
                                <ruby>
                                    {letters(part.word)}
                                    <rt className={`text-[0.42em] font-medium tracking-normal ${part.kind === "review" ? "invisible" : ""}`}>{part.reading}</rt>
                                </ruby>
                            </span>
                        )
                    )}
                </p>
                <div className="flex items-center rounded-lg border-2 border-accent bg-surface-raised px-3 py-2.5 font-jp text-xl" lang="ja">
                    {typed}
                    <span className="ml-0.5 h-6 w-0.5 animate-pulse rounded-full bg-accent" />
                </div>
                <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                    <span><Kbd>Tab</Kbd> reading and meaning</span>
                    <span><Kbd>Shift+Tab</Kbd> romaji and translation</span>
                    <span><Kbd>Enter</Kbd> submit</span>
                </p>
            </div>
        </div>
    );
}

function Kbd({ children }: { children: React.ReactNode }) {
    return <kbd className="rounded border border-border bg-surface-raised px-1.5 py-0.5 font-sans text-[0.7rem] font-semibold text-text">{children}</kbd>;
}
