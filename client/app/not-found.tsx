export default function NotFound() {
    return (
        <div className="flex justify-center h-screen items-center">
            <div className="flex flex-col items-center text-center text-white">
                <h1 className=" font-bold text-xl px-8">Aw mannn... I&apos;ll let that guy know that he didn&apos;t design this page</h1>
                <h1 className="text-main-red font-bold text-6xl px-8 py-2">404!</h1>
                <p>meanwhile go back <a href="/" className="text-main-red underline">here</a></p>
            </div>
        </div>
    );
}