import AuthLogo from "@/components/AuthLogo";

/** Page frame shared by login and signup: the wordmark, then a centred card. */
export default function AuthShell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col">
            <div className="p-5">
                <AuthLogo />
            </div>
            <div className="flex flex-grow items-start justify-center px-4 pb-16 pt-6 sm:items-center sm:pt-0">
                <div className="panel w-full max-w-md p-6 shadow-2xl shadow-black/30 sm:p-8">
                    <h1 className="text-center text-3xl font-bold">{title}</h1>
                    {subtitle && <p className="mt-1 text-center text-sm text-muted">{subtitle}</p>}
                    <div className="mt-6">{children}</div>
                </div>
            </div>
        </div>
    );
}
