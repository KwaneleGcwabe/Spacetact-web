import React, { useRef, useState, useEffect } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";

interface ScrambleTextProps {
  text: string;
  className?: string;
  autoStart?: boolean;
}

const ScrambleText: React.FC<ScrambleTextProps> = ({ text, className, autoStart = true }) => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [displayText, setDisplayText] = useState(text);

  const scramble = () => {
    let iteration = 0;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }

      iteration += 1 / 3; // Adjust speed: lower denominator = faster
    }, 30);
  };

  useEffect(() => {
    if (autoStart) {
      // Delay slightly to ensure visual impact on load
      const timeout = setTimeout(scramble, 500);
      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <span 
      className={`inline-block cursor-default ${className}`}
      onMouseEnter={scramble}
    >
      {displayText}
    </span>
  );
};

export default ScrambleText;