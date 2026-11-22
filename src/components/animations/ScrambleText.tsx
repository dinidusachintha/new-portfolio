import { useTextScramble } from "../../hooks/useTextScramble";

export interface ScrambleTextProps {
  text: string;
  className?: string;
  as?: "span" | "div" | "h1" | "h2" | "h3" | "p";
  duration?: number;
}

export default function ScrambleText({
  text,
  className = "",
  as: Component = "span",
  duration = 800,
}: ScrambleTextProps) {
  const { displayText, triggerScramble } = useTextScramble(text, duration);

  return (
    <Component
      className={`inline-block select-none font-mono tracking-tight ${className}`}
      aria-label={text}
      onMouseEnter={triggerScramble}
      onFocus={triggerScramble}
      tabIndex={0}
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      <span aria-hidden="true">{displayText}</span>
    </Component>
  );
}
