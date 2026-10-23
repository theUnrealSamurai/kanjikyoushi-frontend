"use client";

import Link from "next/link";
import { SyntheticEvent, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import AuthShell from "@/components/AuthShell";
import TextField from "@/components/TextField";
import { errorMessage, post, saveSession } from "@/lib/api";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Signup() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [formError, setFormError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const router = useRouter();

    const errors = {
        username: username.trim().length === 0 ? "Pick a username." : null,
        email: !EMAIL.test(email.trim()) ? "Enter a valid email address." : null,
        password: password.length < 8 ? "Password must be at least 8 characters long." : null,
        confirm: password !== confirmPassword ? "Passwords do not match." : null,
    };
    const isFormValid = Object.values(errors).every((message) => message === null);
    const touch = (field: string) => setTouched((current) => ({ ...current, [field]: true }));
    // An error shows once the field has been left (or the form submitted) and is still empty-or-wrong.
    const shown = (field: keyof typeof errors) => (touched[field] ? errors[field] : null);

    const handleSignup = async (e: SyntheticEvent) => {
        e.preventDefault();
        if (submitting) return;
        if (!isFormValid) {
            setTouched({ username: true, email: true, password: true, confirm: true });
            setFormError("Please fix the highlighted fields.");
            return;
        }
        setFormError(null);
        setSubmitting(true);
        try {
            const response = await post("/home/signup", { username: username.trim(), password, email: email.trim() }, { auth: false });
            const data = await response.json().catch(() => null);
            if (response.ok) {
                saveSession(data);
                toast.success("Signup successful");
                router.push("/type/onboard");
                return;
            }
            setFormError(errorMessage(data, "Signup failed. Please try again."));
        } catch {
            setFormError("Couldn't reach the server. Please try again.");
        }
        setSubmitting(false);
    };

    return (
        <AuthShell title="Create your account" subtitle="Start reading kanji by typing">
            <form onSubmit={handleSignup} noValidate>
                <TextField
                    label="Username"
                    type="text"
                    autoComplete="username"
                    placeholder="pick a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onBlur={() => touch("username")}
                    error={shown("username")}
                />
                <TextField
                    label="Email"
                    type="email"
                    autoComplete="email"
                    placeholder="enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => touch("email")}
                    error={shown("email")}
                />
                <TextField
                    label="Password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="at least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => touch("password")}
                    error={shown("password")}
                />
                <TextField
                    label="Confirm password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={() => touch("confirm")}
                    error={shown("confirm")}
                />
                {formError && <p role="alert" className="mb-4 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">{formError}</p>}
                <button className="btn-primary w-full" type="submit" disabled={submitting}>
                    {submitting ? "Creating account…" : "Sign up"}
                </button>
                <p className="mt-5 text-center text-sm text-muted">
                    Already have an account? <Link href="/login" className="font-semibold text-accent hover:text-accent-hover">Login</Link>
                </p>
            </form>
        </AuthShell>
    );
}
