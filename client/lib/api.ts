import Cookies from "js-cookie";

const API_HOST = process.env.NEXT_PUBLIC_HOST ?? "http://localhost:8000";

interface Session {
    access: string;
    refresh: string;
    user: { username: string };
}

export function saveSession(session: Session) {
    Cookies.set("accessToken", session.access, { sameSite: "strict" });
    Cookies.set("refreshToken", session.refresh, { sameSite: "strict" });
    Cookies.set("username", session.user.username, { sameSite: "strict" });
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
