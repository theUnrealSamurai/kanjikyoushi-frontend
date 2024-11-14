"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from "js-cookie";

const NavBar: React.FC = () => {
    const pathname = usePathname();
    const router = useRouter();
    const username_cookie = Cookies.get("username");
    const [username, setUsername] = useState<string>('');

    useEffect(() => {
        setUsername(username_cookie || 'GuestUser');
    }, [username_cookie]);

    const logout = () => {
        Cookies.remove("username");
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        setUsername('GuestUser');
        router.push("/");
    };

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
                    <div className="relative group">
                        <h4 className="cursor-pointer hover:text-main-red pr-2 mx-4">
                            <span className={pathname === '/type/practice' || pathname === '/type/revision' ? 'text-main-red underline decoration-main-red decoration-2 underline-offset-8' : ''}> T</span>
                            <span className={pathname === '/type/revision' || pathname === '/type/practice' ? 'underline decoration-main-red decoration-2 underline-offset-8' : ''}>ype </span>
                        </h4>
                        <div className="absolute hidden group-hover:block drop-shadow-xl bg-main-gray p-5 rounded-md">
                            <h4 className="cursor-pointer hover:text-main-red">
                                <Link href="/type/practice">Practice</Link>
                            </h4>
                            <h4 className="cursor-pointer mt-5 hover:text-main-red">
                                <Link href="/type/revision">Revision</Link>
                            </h4>
                        </div>
                    </div>
                    <h4 className="cursor-pointer hover:text-main-red pr-1 mx-3">
                        <Link href="/about">
                            <span className={pathname === '/about' ? 'text-main-red underline decoration-main-red decoration-2 underline-offset-8' : ''}> A</span>
                            <span className={pathname === '/about' ? 'underline decoration-main-red decoration-2 underline-offset-8' : ''}>bout </span>
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
