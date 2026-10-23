"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from "js-cookie";
import { clearSession } from "@/lib/api";

const NavBar: React.FC = () => {
    const pathname = usePathname();
    const router = useRouter();
    const username_cookie = Cookies.get("username");
    const [username, setUsername] = useState<string>('');

    useEffect(() => {
        setUsername(username_cookie || 'GuestUser');
    }, [username_cookie]);

    const logout = () => {
        clearSession();
        setUsername('GuestUser');
        router.push("/");
    };

    const typing = pathname.startsWith('/type');

    return (
        <nav className="w-screen flex justify-center">
            <div className="w-[98%] flex justify-between mt-4 bg-main-gray p-4 rounded-2xl drop-shadow-lg shadow-lg">
                <div className="pl-3 w-4/5 h-full">
                    <Link href="/" className="font-bold">
                        <h1 className="text-white font-bold text-2xl">
                            <span className="text-main-red">Type</span><span>Kanji</span>
                        </h1>
                    </Link>
                </div>
                <div className="flex w-1/5 justify-end text-white font-bold text-xl">
                    <h4 className="cursor-pointer hover:text-main-red pr-2 mx-4">
                        <Link href="/type/practice">
                            <span className={typing ? 'text-main-red underline decoration-main-red decoration-2 underline-offset-8' : ''}>T</span>
                            <span className={typing ? 'underline decoration-main-red decoration-2 underline-offset-8' : ''}>ype</span>
                        </Link>
                    </h4>
                    <div className="relative group">
                        <h4 className="cursor-pointer hover:text-main-red pr-1 mx-3">
                            {username}
                        </h4>
                        <div className="absolute hidden group-hover:block drop-shadow-xl bg-main-gray p-5 rounded-md right-0">
                            {username !== 'GuestUser' ? (
                                <h4 className="cursor-pointer hover:text-main-red" onClick={logout}>
                                    Logout
                                </h4>
                            ) : (
                                <h4 className="cursor-pointer hover:text-main-red">
                                    <Link href="/login">Login</Link>
                                </h4>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;
