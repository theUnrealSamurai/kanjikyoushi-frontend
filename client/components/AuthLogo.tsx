import Link from "next/link";

/** The TypeKanji wordmark. */
export default function AuthLogo({ className = "text-2xl" }: { className?: string }) {
    return (
        <Link href="/" className={`font-bold tracking-tight text-text ${className}`}>
            <span className="text-accent">Type</span>Kanji
        </Link>
    );
}
