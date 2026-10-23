// Minimal typings for Chrome's built-in Translator API (Chrome 138+).
// https://developer.chrome.com/docs/ai/translator-api

type TranslatorAvailability = "unavailable" | "downloadable" | "downloading" | "available";

interface TranslatorDownloadProgressEvent extends Event {
    /** 0..1 */
    readonly loaded: number;
}

interface TranslatorCreateMonitor {
    addEventListener(type: "downloadprogress", listener: (event: TranslatorDownloadProgressEvent) => void): void;
}

interface TranslatorLanguages {
    sourceLanguage: string;
    targetLanguage: string;
}

interface TranslatorCreateOptions extends TranslatorLanguages {
    monitor?: (monitor: TranslatorCreateMonitor) => void;
    signal?: AbortSignal;
}

declare class Translator {
    static availability(options: TranslatorLanguages): Promise<TranslatorAvailability>;
    static create(options: TranslatorCreateOptions): Promise<Translator>;
    readonly sourceLanguage: string;
    readonly targetLanguage: string;
    translate(text: string, options?: { signal?: AbortSignal }): Promise<string>;
    destroy(): void;
}
