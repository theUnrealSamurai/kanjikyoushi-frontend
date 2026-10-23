import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex h-screen items-center justify-center px-6">
            <div className="flex flex-col items-center text-center">
                <h1 className="max-w-xl text-xl font-bold">Aw mannn... I&apos;ll let that guy know that he didn&apos;t design this page</h1>
                <p className="py-3 text-7xl font-extrabold text-accent">404!</p>
                <p className="text-muted">meanwhile go back <Link href="/" className="font-semibold text-accent underline underline-offset-4 hover:text-accent-hover">here</Link></p>
            </div>
        </div>
    );
}
