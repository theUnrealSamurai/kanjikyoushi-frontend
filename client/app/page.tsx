import NavBar from "@/components/NavBar";

export default function Home() {
    return (
        <div className="min-h-screen overflow-hidden flex flex-col">
            <NavBar />
            <div className="flex flex-grow flex-col justify-center items-center py-8">
                <div className="-mt-24 flex flex-col items-center text-white">
                    <h1 className="font-bold text-3xl md:text-4xl px-5 pb-2 text-center">Welcome to TypeKanji!</h1>
                    <p className="px-7 py-2 text-center max-w-2xl">
                        Learn to read kanji by typing real Japanese sentences. New words show their furigana while
                        you get to know them. Words you&apos;ve learned come back for review with the furigana hidden,
                        and if you get stuck, press Tab. How you type each word is the review, so there are no
                        flashcards to rate.
                    </p>
                    <h1 className="px-5 pt-2 pb-5 font-bold text-xl md:text-2xl text-center">Learn by Typing and remember using Spaced Repetition!</h1>
                    <a href="/type/practice" className="bg-main-red text-lg font-bold py-2 px-8 rounded-xl">Start Learning</a>
                </div>
            </div>
            <div className="flex flex-row items-start justify-between text-white m-2 text-sm w-full">
                <a href="https://github.com/theUnrealSamurai/kanjikyoushi-frontend" target="_blank" className="mx-2">GitHub</a>
                <p className="mr-4">© 2024 Type Kanji</p>
            </div>
        </div>
    );
}
