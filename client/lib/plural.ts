/** "1 word", "2 words": the count with its noun, pluralised with a plain "s" unless `many` is given ("kanji"). */
export const plural = (count: number, noun: string, many = `${noun}s`) => `${count} ${count === 1 ? noun : many}`;
