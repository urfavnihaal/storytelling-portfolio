import React, { useEffect, useRef, useState } from "react";

export function Counter({ value }: { value: string }) {
  const num = parseInt(value);
  const [count, setCount] = useState(isNaN(num) ? 0 : num - 15);
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (visible && !isNaN(num)) {
      let start = num - 15;
      if (start < 2000) start = 2000;
      let current = start;
      const step = () => {
        current += 1;
        setCount(current);
        if (current < num) {
          setTimeout(step, 45);
        } else {
          setCount(num);
        }
      };
      step();
    }
  }, [visible, num]);

  return <span ref={ref}>{isNaN(num) ? value : count}</span>;
}

export default Counter;
