"use client";

import React from "react";
import { usePathname } from 'next/navigation';

export default function NavBar() {
    const pathname = usePathname();

    return (
        <nav className="w-screen flex justify-center">
            <div className="w-[98%] flex justify-between mt-4 bg-main-gray p-5 rounded-2xl drop-shadow-lg shadow-lg">
                <div className="pl-3 w-4/5 h-full">
                    <a href="/" className="font-bold text-main-red">
                        T<span className="text-white">Y</span>PE K
                        <span className="text-white">A</span>NJI
                    </a>
                </div>
                <div className="flex w-1/5 justify-end text-white font-bold">
                    <div className="relative group">
                        <h4 className="cursor-pointer hover:text-main-red pr-2 mx-4"><span className={pathname === '/type/practice' || pathname === '/type/revision' ? 'text-main-red underline decoration-main-red decoration-2 underline-offset-8': ''}> T</span><span className={pathname === '/type/revision' || pathname === '/type/practice' ? 'underline decoration-main-red decoration-2 underline-offset-8': ''}>YPE </span></h4>
                        <div className="absolute hidden group-hover:block drop-shadow-xl  bg-main-gray p-5 rounded-md">
                            <h4 className="cursor-pointer hover:text-main-red">
                                <a href="/type/practice">Practice</a>
                            </h4>
                            <h4 className="cursor-pointer mt-5 hover:text-main-red">
                                <a href="/type/revision">Revision</a>
                            </h4>
                        </div>
                    </div>
                    <h4 className="cursor-pointer hover:text-main-red pr-5 mx-4">
                        <a href="/about"><span className={pathname === '/about' ? 'text-main-red underline decoration-main-red decoration-2 underline-offset-8': ''}> A</span><span className={pathname === '/about' ? 'underline decoration-main-red decoration-2 underline-offset-8': ''}>BOUT </span></a>
                    </h4>
                </div>
            </div>
        </nav>
    );
}