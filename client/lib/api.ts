import Cookies from "js-cookie";

const API_HOST = process.env.NEXT_PUBLIC_HOST ?? "http://localhost:8000";

interface Session {
    access: string;
    refresh: string;
    user: { username: string };
}

export function saveSession(session: Session) {
    Cookies.set("accessToken", session.access, { sameSite: "lax" });
    Cookies.set("refreshToken", session.refresh, { sameSite: "lax" });
    Cookies.set("username", session.user.username, { sameSite: "lax" });
}

export function clearSession() {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("username");
}

/** POST JSON to the backend. Authenticated calls send the saved token and go to /login when it's missing or expired. */
export async function post(path: string, body?: object, { auth = true } = {}): Promise<Response> {
    const token = Cookies.get("accessToken");
    if (auth && !token) {
        window.location.href = "/login";
        return new Promise(() => {});
    }

    const response = await fetch(API_HOST + path, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // The backend works out "today" (stats, words learned today) in the browser's timezone.
            "X-Timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
            ...(auth ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
    });
    if (auth && response.status === 401) {
        clearSession();
        window.location.href = "/login";
        return new Promise(() => {});
    }
    return response;
}

/** The first readable message from a Django REST Framework error body. */
export function errorMessage(data: unknown, fallback: string): string {
    if (data && typeof data === "object") {
        const record = data as Record<string, unknown>;
        if (typeof record.error === "string") return record.error;
        for (const value of Object.values(record)) {
            if (Array.isArray(value) && typeof value[0] === "string") return value[0];
        }
    }
    return fallback;
}

/** Message for a 429 throttle response, reading the wait (in seconds) from DRF's "Expected available in N seconds." detail. */
export function throttledMessage(data: unknown): string {
    const detail = data && typeof data === "object" ? (data as Record<string, unknown>).detail : null;
    const seconds = typeof detail === "string" ? Number(detail.match(/\d+/)?.[0]) : NaN;
    if (!Number.isFinite(seconds)) return "Too many attempts. Try again later.";
    const minutes = Math.max(1, Math.ceil(seconds / 60));
    return `Too many attempts. Try again in ${minutes} ${minutes === 1 ? "minute" : "minutes"}.`;
}
