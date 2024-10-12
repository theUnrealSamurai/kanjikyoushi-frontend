export default function Home() {
    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <div className="-mt-32 flex flex-col items-center"> 
                <h1 className="text-white font-bold text-4xl px-5 pb-2 text-center">Welcome to TypeKanji!</h1>
                <p className="px-7 py-2 text-center">Some lorem ipsum here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sollicitudin fringilla eros id scelerisque. Phasellus ultrices sagittis mi ut scelerisque. Sed blandit ante non metus porta, vitae fermentum ex egestas. Quisque sollicitudin pellentesque nibh et lacinia. Etiam tortor purus, efficitur et posuere eget, consectetur vel lacus. Mauris lacinia, justo in. LOREM IPUSMMM!</p>
                <h1 className="px-5 pt-2 pb-5 font-bold text-2xl text-center">Learn by Typing and remember by Reading!</h1>
                <a href='/type/practice' className="bg-main-red text-white text-lg font-bold py-2 px-8 rounded-xl">Start Learning</a>
            </div>
        </div>
    );
}
