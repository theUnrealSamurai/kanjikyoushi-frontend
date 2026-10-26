"use client";

import React, { SyntheticEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import AuthShell from "@/components/AuthShell";
import TextField from "@/components/TextField";
import { errorMessage, post, saveSession, throttledMessage } from "@/lib/api";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: SyntheticEvent) => {
        e.preventDefault();
        if (submitting) return;
        if (!username.trim() || !password) {
            setError("Enter your username or email and your password.");
            return;
        }
        setError(null);
        setSubmitting(true);
        try {
            const response = await post("/home/login", { username: username.trim(), password }, { auth: false });
            const data = await response.json().catch(() => null);
            if (!response.ok) {
                setError(
                    response.status === 401 ? "Wrong username or password."
                    : response.status === 429 ? throttledMessage(data)
                    : errorMessage(data, "Login failed. Please try again."),
                );
                setSubmitting(false);
                return;
            }
            saveSession(data);
            toast.success("Login successful");
            router.push("/type/practice");
        } catch {
            setError("Couldn't reach the server. Please try again.");
            setSubmitting(false);
        }
    };

    return (
        <AuthShell title="Welcome back" subtitle="Log in to pick up where you left off">
            <form onSubmit={handleLogin} noValidate>
                <TextField
                    label="Username or email"
                    type="text"
                    autoComplete="username"
                    placeholder="enter your username / email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <p role="alert" className="mb-4 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>}
                <button className="btn-primary w-full" type="submit" disabled={submitting}>
                    {submitting ? "Logging in…" : "Login"}
                </button>
                <p className="mt-5 text-center text-sm text-muted">
                    Don&apos;t have an account? <Link href="/signup" className="font-semibold text-accent hover:text-accent-hover">Sign up</Link>
                </p>
            </form>
        </AuthShell>
    );
}
