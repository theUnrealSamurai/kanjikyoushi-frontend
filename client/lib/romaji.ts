/** Kana -> the keys to press with a Japanese IME (Mac and Windows). Not textbook Hepburn: it spells out
 *  what the IME needs, e.g. づ = "du", ぢ = "di", を = "wo", ん = "nn", small kana with "x". */

const KEYS: Record<string, string> = {
    あ: "a", い: "i", う: "u", え: "e", お: "o",
    か: "ka", き: "ki", く: "ku", け: "ke", こ: "ko",
    さ: "sa", し: "shi", す: "su", せ: "se", そ: "so",
    た: "ta", ち: "chi", つ: "tsu", て: "te", と: "to",
    な: "na", に: "ni", ぬ: "nu", ね: "ne", の: "no",
    は: "ha", ひ: "hi", ふ: "fu", へ: "he", ほ: "ho",
    ま: "ma", み: "mi", む: "mu", め: "me", も: "mo",
    や: "ya", ゆ: "yu", よ: "yo",
    ら: "ra", り: "ri", る: "ru", れ: "re", ろ: "ro",
    わ: "wa", ゐ: "wi", ゑ: "we", を: "wo", ん: "nn",
    が: "ga", ぎ: "gi", ぐ: "gu", げ: "ge", ご: "go",
    ざ: "za", じ: "ji", ず: "zu", ぜ: "ze", ぞ: "zo",
    だ: "da", ぢ: "di", づ: "du", で: "de", ど: "do",
    ば: "ba", び: "bi", ぶ: "bu", べ: "be", ぼ: "bo",
    ぱ: "pa", ぴ: "pi", ぷ: "pu", ぺ: "pe", ぽ: "po",
    ゔ: "vu",
    ぁ: "xa", ぃ: "xi", ぅ: "xu", ぇ: "xe", ぉ: "xo",
    ゃ: "xya", ゅ: "xyu", ょ: "xyo", ゎ: "xwa", っ: "xtu",
    ー: "-", "、": ",", "。": ".", "！": "!", "？": "?", "「": "[", "」": "]", "・": "/", "〜": "~",
};

// Two kana typed as one syllable: きゃ = "kya", ふぁ = "fa", てぃ = "thi".
const PAIRS: Record<string, string> = {
    ふぁ: "fa", ふぃ: "fi", ふぇ: "fe", ふぉ: "fo",
    てぃ: "thi", でぃ: "dhi", とぅ: "twu", どぅ: "dwu",
    うぃ: "wi", うぇ: "we", うぉ: "who",
    しぇ: "she", ちぇ: "che", じぇ: "je",
    ゔぁ: "va", ゔぃ: "vi", ゔぇ: "ve", ゔぉ: "vo",
};
const SMALL_Y: Record<string, string> = { ゃ: "a", ゅ: "u", ょ: "o" };

const toHiragana = (text: string) =>
    Array.from(text).map((c) => (c >= "ァ" && c <= "ヶ" ? String.fromCharCode(c.charCodeAt(0) - 0x60) : c)).join("");

export function imeKeys(kana: string): string {
    const chars = Array.from(toHiragana(kana));
    const out: string[] = [];
    for (let i = 0; i < chars.length; i++) {
        const c = chars[i], next = chars[i + 1];
        if (next && PAIRS[c + next]) {
            out.push(PAIRS[c + next]);
            i++;
        } else if (next && SMALL_Y[next] && KEYS[c]?.endsWith("i") && c !== "い") {
            // きゃ = "kya", しゃ = "sha", ちゃ = "cha", じゃ = "ja", ぢゃ = "dya"
            const stem = KEYS[c].slice(0, -1);
            out.push((["sh", "ch", "j"].includes(stem) ? stem : stem + "y") + SMALL_Y[next]);
            i++;
        } else if (c === "っ" && next) {
            // Double the next consonant (った = "tta"); before a vowel or ん there's nothing to double.
            const following = imeKeys(chars.slice(i + 1).join(""))[0];
            out.push(following && /[bcdfghjkmpqrstvwyz]/.test(following) ? following : "xtu");
        } else {
            out.push(KEYS[c] ?? c);
        }
    }
    return out.join("");
}
