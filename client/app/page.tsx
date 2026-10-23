import Link from "next/link";
import NavBar from "@/components/NavBar";

const STEPS = [
    {
        title: "New words show their furigana",
        body: "A word you are meeting for the first time is highlighted in amber with its reading above it, so you can type it while you get to know it.",
        tone: "text-new-word",
    },
    {
        title: "Learned words come back hidden",
        body: "Words you've learned return for review with the furigana hidden. How you type each one is the review, so there are no flashcards to rate.",
        tone: "text-review-word",
    },
    {
        title: "Stuck? Press Tab",
        body: "Tab reveals the reading of the word you're on and opens its dictionary card. Shift+Tab shows every reading, the romaji and an English translation.",
        tone: "text-accent",
    },
];

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col">
            <NavBar />
            <div className="mx-auto flex w-full max-w-4xl flex-grow flex-col items-center px-5 py-12 text-center sm:py-20">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                    Welcome to <span className="text-accent">Type</span>Kanji!
                </h1>
                <p className="mt-5 max-w-2xl text-lg text-muted">
                    Learn to read kanji by typing real Japanese sentences. New words show their furigana while
                    you get to know them. Words you&apos;ve learned come back for review with the furigana hidden,
                    and if you get stuck, press Tab. How you type each word is the review, so there are no
                    flashcards to rate.
                </p>

                <div className="panel mt-10 w-full max-w-2xl px-6 py-8 shadow-2xl shadow-black/30" aria-hidden>
                    <p className="font-jp text-2xl font-medium leading-[2.7] sm:text-3xl sm:leading-[2.7]" lang="ja">
                        今日は
                        <span className="border-b-2 border-new-word text-new-word"><ruby>先生<rt className="text-[0.42em]">せんせい</rt></ruby></span>
                        と
                        <span className="border-b-2 border-review-word text-review-word"><ruby>会議<rt className="invisible text-[0.42em]">かいぎ</rt></ruby></span>
                        があります。
                    </p>
                    <p className="mt-2 text-xs text-muted">
                        <span className="text-new-word">new word</span> with furigana · <span className="text-review-word">review word</span> with furigana hidden
                    </p>
                </div>

                <h2 className="mt-12 text-xl font-bold sm:text-2xl">Learn by Typing and remember using Spaced Repetition!</h2>
                <Link href="/type/practice" className="btn-primary mt-6 px-8 py-3 text-lg">Start Learning</Link>

                <ol className="mt-16 grid w-full gap-4 text-left sm:grid-cols-3">
                    {STEPS.map((step, i) => (
                        <li key={step.title} className="panel p-5">
                            <span className={`text-sm font-bold ${step.tone}`}>0{i + 1}</span>
                            <h3 className="mt-1 font-semibold">{step.title}</h3>
                            <p className="mt-2 text-sm text-muted">{step.body}</p>
                        </li>
                    ))}
                </ol>
            </div>
            <footer className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 text-sm text-muted">
                <a href="https://github.com/theUnrealSamurai/kanjikyoushi-frontend" target="_blank" rel="noreferrer" className="hover:text-accent">GitHub</a>
                <p>© {new Date().getFullYear()} Type Kanji</p>
            </footer>
        </div>
    );
}
