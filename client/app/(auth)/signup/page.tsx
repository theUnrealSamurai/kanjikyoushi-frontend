"use client";

import Link from "next/link";
import { SyntheticEvent, useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import toast from "react-hot-toast";
import Cookies from "js-cookie";

export default function Signup() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isFormValid, setIsFormValid] = useState(false);

    const router = useRouter();

    useEffect(() => {
        // Check form validity
        const isValid =
            username.length > 0 &&
            email.length > 0 &&
            password.length >= 8 &&
            password === confirmPassword;
        setIsFormValid(isValid);
    }, [username, email, password, confirmPassword]);

    const handleSignup = async (e: SyntheticEvent) => {
        e.preventDefault();
        if (!isFormValid) {
            toast.error("Please fill all fields correctly");
            return;
        }

        const toastId = toast.loading("Signing up...");

        try {
            const response = await fetch(process.env.NEXT_PUBLIC_HOST + "/home/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "username": username,
                    "password": password,
                    "email": email
                })
            });

            if (response.ok) {
                const data = await response.json();
                toast.success("Signup successful", { id: toastId });
                Cookies.set("accessToken", data.access);
                router.push("/");
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || "Signup failed", { id: toastId });
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("An error occurred. Please try again.", { id: toastId });
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-main-gray">
            <div className="text-2xl font-bold p-4">
                <span className="text-main-red">T</span>
                <span className="text-white">Y</span>
                <span className="text-main-red">PE K</span>
                <span className="text-white">A</span>
                <span className="text-main-red">NJI</span>
            </div>
            <div className="flex items-center justify-center flex-grow">
                <div className="flex flex-col border-2 text-white border-main-red h-fit w-96 rounded-2xl drop-shadow-lg shadow-white bg-[#453F3F]">
                    <div className="flex flex-col m-2">
                        <h1 className="font-bold text-3xl text-center mb-4">Sign Up!</h1>
                        <form className="flex flex-col" onSubmit={handleSignup}>
                            <p className="ml-2">username</p>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="mx-2 mb-2 py-1 px-2 bg-black rounded-lg placeholder:text-sm placeholder:text-gray"
                                placeholder="pick a username" />
                            <p className="ml-2">email</p>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mx-2 mb-2 py-1 px-2 bg-black rounded-lg placeholder:text-sm placeholder:text-gray"
                                placeholder="enter your email" />
                            <p className="ml-2">password</p>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mx-2 mb-2 py-1 px-2 bg-black rounded-lg placeholder:text-sm placeholder:text-gray"
                                placeholder="pick a password" />
                            {password.length > 0 && password.length < 8 && (
                                <p className="text-red-500 text-xs ml-2">Password must be at least 8 characters long</p>
                            )}
                            <p className="ml-2">confirm password</p>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="mx-2 mb-2 py-1 px-2 bg-black rounded-lg placeholder:text-sm placeholder:text-gray"
                                placeholder="confirm password" />
                            {confirmPassword.length > 0 && password !== confirmPassword && (
                                <p className="text-red-500 text-xs ml-2">Passwords do not match</p>
                            )}
                            <button
                                className={`mx-2 mt-2 p-1 px-4 rounded-2xl font-bold ${isFormValid ? 'bg-main-red text-white' : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                                    }`}
                                type="submit"
                                disabled={!isFormValid}>
                                Sign Up
                            </button>
                        </form>
                        <button className="m-2 p-1 px-4 bg-white text-black rounded-2xl font-bold">Sign Up with Google</button>
                        <p className="text-center mt-2">
                            Already have an account?
                            <Link href="/login/" className="text-main-red font-bold ml-1">Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
