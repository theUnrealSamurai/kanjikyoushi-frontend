"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { clearSession } from "@/lib/api";
import AuthLogo from "@/components/AuthLogo";

const GUEST = "GuestUser";

const NavBar: React.FC = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [username, setUsername] = useState<string>("");

    // Read the cookie after mount so the server and first client render agree.
    useEffect(() => {
        setUsername(Cookies.get("username") || GUEST);
    }, [pathname]);

    const logout = () => {
        clearSession();
        setUsername(GUEST);
        router.push("/");
    };

    const typing = pathname.startsWith("/type");
    const signedIn = username !== "" && username !== GUEST;

    return (
        <nav className="flex w-full justify-center px-3 pt-3 sm:px-4 sm:pt-4">
            <div className="flex w-full max-w-6xl items-center justify-between rounded-2xl border border-border bg-surface px-4 py-3 shadow-lg shadow-black/20">
                <AuthLogo />
                <div className="flex items-center gap-1 text-sm font-semibold sm:gap-3">
                    <Link
                        href="/type/practice"
                        className={`rounded-lg px-3 py-1.5 transition-colors hover:text-accent ${typing ? "bg-accent/15 text-accent" : "text-muted"}`}
                    >
                        Type
                    </Link>
                    <div className="group relative">
                        <button
                            type="button"
                            className="max-w-[10rem] truncate rounded-lg px-3 py-1.5 text-text transition-colors hover:text-accent"
                            aria-haspopup="menu"
                        >
                            {username || GUEST}
                        </button>
                        <div className="invisible absolute right-0 top-full z-20 pt-1 opacity-0 transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                            <div className="min-w-[8rem] rounded-xl border border-border bg-surface-raised p-1 shadow-xl shadow-black/40">
                                {signedIn ? (
                                    <button
                                        type="button"
                                        onClick={logout}
                                        className="w-full rounded-lg px-3 py-2 text-left hover:bg-accent/15 hover:text-accent"
                                    >
                                        Logout
                                    </button>
                                ) : (
                                    <Link href="/login" className="block rounded-lg px-3 py-2 hover:bg-accent/15 hover:text-accent">
                                        Login
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
