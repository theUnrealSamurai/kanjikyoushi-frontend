'use client';

import React, {SyntheticEvent, useState} from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import AuthLogo from "@/components/AuthLogo";


export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = async (e: SyntheticEvent) => {
        toast.loading("Logging in...");
        e.preventDefault();

        const response = await fetch(process.env.NEXT_PUBLIC_HOST + "/home/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "username": username,
                "password": password
            })
        });

        if (response.ok) {
            const data = await response.json();
            toast.dismiss();
            console.log(data);
            toast.success("Login successful");
            Cookies.set("accessToken", data.access);
            router.push("/");

        } else {
            console.log("Error:", response.status, response.statusText);
        }
        
    };



    return (
        <div className="flex flex-col min-h-screen bg-main-gray">
            <AuthLogo />
            <div className="flex items-center justify-center flex-grow">
                <div className="flex flex-col border-2 text-white border-main-red h-fit w-96 rounded-2xl drop-shadow-lg shadow-white bg-[#453F3F]">
                    <div className="flex flex-col m-2">
                        <h1 className="font-bold text-3xl text-center mb-8 mt-2">Welcome Back!</h1>
                        <form onSubmit={handleLogin} className="flex flex-col">
                            <p className="ml-2">username / email</p>
                            <input 
                                type="text" 
                                className="mx-2 mb-2 py-1 px-2 bg-black rounded-lg placeholder:text-sm placeholder:text-gray" 
                                placeholder="enter your username / email" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <p className="ml-2">password</p>
                            <input 
                                type="password" 
                                className="mx-2 mb-2 py-1 px-2 bg-black rounded-lg placeholder:text-sm placeholder:text-gray" 
                                placeholder="enter your password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button 
                                className="mx-2 mt-2 p-1 px-4 bg-main-red rounded-2xl font-bold"
                                type="submit">
                                    Login
                            </button>
                            <button className="m-2 p-1 px-4 bg-white text-black rounded-2xl font-bold">Sign In with Google</button>
                            <p className="text-center mt-2">Don't have an account? <Link href="/signup/" className="text-main-red font-bold">signup</Link></p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
