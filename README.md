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
| **sky** word | review word: furigana hidden; how you type it is the review |
| `Tab` | reveal the reading of the review word you're on (counts as Hard) |
| `Shift+Tab` | help: every reading, plus romaji and translation (untyped review words count as Hard) |
| `Enter` | submit; a fully typed sentence also submits by itself |

Typing the wrong kanji inside a review word counts as Again. Typing it without help counts as Good.
There is no separate revision page: reviews are mixed into the sentences you type.

The original version is kept on the `roshan-original-main` branch.
