import NavBar from "@/components/NavBar";

export default function Home() {
    return (
        <div className="min-h-screen overflow-hidden flex flex-col">
            <NavBar />
            <div className="flex flex-grow flex-col justify-center items-center py-8">
                <div className="-mt-24 flex flex-col items-center text-white">
                    <h1 className="font-bold text-3xl md:text-4xl px-5 pb-2 text-center">Welcome to TypeKanji!</h1>
                    <p className="px-7 py-2 text-center max-w-[80%]">Some lorem ipsum here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sollicitudin fringilla eros id scelerisque. Phasellus ultrices sagittis mi ut scelerisque. Sed blandit ante non metus porta, vitae fermentum ex egestas. Quisque sollicitudin pellentesque nibh et lacinia. Etiam tortor purus, efficitur et posuere eget, consectetur vel lacus. Mauris lacinia, justo in. LOREM IPUSMMM!</p>
                    <h1 className="px-5 pt-2 pb-5 font-bold text-xl md:text-2xl text-center">Learn by Typing and remember using Spaced Repetition!</h1>
                    <a href='/type/practice' className="bg-main-red text-lg font-bold py-2 px-8 rounded-xl">Start Learning</a>
                </div>
            </div>
            {/* Bottom Contacts and stuff */}
            <div className="flex flex-row items-start justify-between text-white m-2 text-sm w-full">
                <div className="flex">
                    <a href="mailto: bananas@gmail.com" className="mx-2">Contact</a>
                    <a href="https://www.discord.com/" target="_blank" className="mx-2">Discord</a>
                    <a href="https://www.github.com/type-kanji/" target="_blank" className="mx-2">GitHub</a>
                </div>
                <p className="mr-4">© 2024 Type Kanji. All Rights Reserved?</p>
            </div>

        </div>
    );
}
