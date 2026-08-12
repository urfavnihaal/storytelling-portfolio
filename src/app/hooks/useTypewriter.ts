import { useEffect, useState } from "react";

export function useTypewriter(words: string[], speed = 78, pause = 2100, enabled = true) {
  const [text, setText] = useState("");
  const [wIdx, setWIdx] = useState(0);
  const [typing, setTyping] = useState(true);
  useEffect(() => {
    if (!enabled) return;
    const word = words[wIdx];
    if (typing) {
      if (text.length < word.length) {
        const t = setTimeout(() => setText(word.slice(0, text.length + 1)), speed);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setTyping(false), pause);
      return () => clearTimeout(t);
    } else {
      if (text.length > 0) {
        const t = setTimeout(() => setText(word.slice(0, text.length - 1)), 38);
        return () => clearTimeout(t);
      }
      setWIdx((i) => (i + 1) % words.length);
      setTyping(true);
    }
  }, [text, typing, wIdx, words, speed, pause, enabled]);
  return text;
}
