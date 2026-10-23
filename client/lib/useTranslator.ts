"use client";

import { useCallback, useRef, useState } from "react";

/** English translation of a Japanese sentence through Chrome's on-device Translator API (Chrome 138+). */
export type TranslationState =
    | { status: "loading" }
    | { status: "done"; text: string }
    | { status: "unavailable" }
    | { status: "error" };

const LANGUAGES = { sourceLanguage: "ja", targetLanguage: "en" };

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * `request()` must be called straight from a user gesture (the Shift+Tab key handler): the first call may have to
 * download the language model, and Chrome only allows that with user activation. One translator is reused for the
 * whole session and finished translations are cached per sentence id.
 */
export function useTranslator() {
    const [states, setStates] = useState<Record<number, TranslationState>>({});
    const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
    const translator = useRef<Promise<Translator> | null>(null);
    const inFlight = useRef(new Set<number>());
    const done = useRef(new Set<number>());

    const set = useCallback((id: number, state: TranslationState) => {
        setStates((current) => ({ ...current, [id]: state }));
    }, []);

    const request = useCallback((id: number, text: string) => {
        if (done.current.has(id) || inFlight.current.has(id)) return;
        if (typeof self === "undefined" || !("Translator" in self)) {
            set(id, { status: "unavailable" });
            return;
        }
        inFlight.current.add(id);
        set(id, { status: "loading" });

        if (!translator.current) {
            const options: TranslatorCreateOptions = {
                ...LANGUAGES,
                monitor(monitor) {
                    monitor.addEventListener("downloadprogress", (event) => setDownloadProgress(event.loaded));
                },
            };
            // The first create() is started synchronously (user activation); the async wrapper only adds one retry.
            const creating = (async () => {
                try {
                    return await Translator.create(options);
                } catch (error) {
                    // Chrome sometimes rejects the very first create() while its translation component is still
                    // installing, even though the language pair is supported. Give it a moment and try once more.
                    const transient = error instanceof DOMException && error.name === "NotSupportedError"
                        && (await Translator.availability(LANGUAGES)) !== "unavailable";
                    if (!transient) throw error;
                    await sleep(1500);
                    return Translator.create(options);
                }
            })();
            translator.current = creating;
            creating.then(
                () => setDownloadProgress(null),
                () => {
                    setDownloadProgress(null);
                    if (translator.current === creating) translator.current = null;  // let the next request retry
                },
            );
        }

        translator.current
            .then((t) => t.translate(text))
            .then((english) => {
                done.current.add(id);
                set(id, { status: "done", text: english });
            })
            .catch(async () => {
                let unavailable = false;
                try {
                    unavailable = (await Translator.availability(LANGUAGES)) === "unavailable";
                } catch {
                    unavailable = false;
                }
                set(id, { status: unavailable ? "unavailable" : "error" });
            })
            .finally(() => inFlight.current.delete(id));
    }, [set]);

    return { states, downloadProgress, request };
}
