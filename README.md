# KanjiKyoushi frontend

Next.js client for KanjiKyoushi: learn to read kanji by typing real Japanese sentences.
The API lives in [kanjikyoushi-backend](https://github.com/theUnrealSamurai/kanjikyoushi-backend).

## Setup

```bash
cd client
cp .env.example .env.local   # NEXT_PUBLIC_HOST = the backend URL
npm install
npm run dev                  # http://localhost:3000
```

## The typing page

Type the sentence with your Japanese input method on. Everything works from the keyboard:

| | |
|---|---|
| **amber** word | new word: furigana shown while you get to know it (3 sightings) |
| **aqua** word | review word: furigana hidden; how you type it is the review |
| `Tab` | reveal the reading of the review word you're on and open its dictionary card (counts as Hard) |
| `Shift+Tab` | help: every reading, every dictionary card, romaji and an English translation (untyped review words count as Hard) |
| `Enter` | submit; a fully typed sentence also submits by itself |

New words always show their dictionary card (meanings plus a kanji breakdown) at the bottom of the page.
The English translation comes from Chrome's built-in Translator API (Chrome 138+, on-device; the first use downloads the ja to en model).
Signed-out visitors are redirected from `/type/*` to `/login` by `middleware.ts`.

Typing the wrong kanji inside a review word counts as Again. Typing it without help counts as Good.
There is no separate revision page: reviews are mixed into the sentences you type.

The original version is kept on the `roshan-original-main` branch.
