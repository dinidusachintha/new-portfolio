import { forwardRef } from "react";

const NAME_LETTERS = ["D", "I", "N", "I", "D", "U"];

export interface IntroTypographyProps {
  className?: string;
}

export const IntroTypography = forwardRef<HTMLDivElement, IntroTypographyProps>(
  ({ className = "" }, ref) => {
    return (
      <div
        ref={ref}
        className={`intro-typography-wrap ${className}`}
        aria-label="Dinidu. Creative Developer"
      >
        <div className="intro-name-container">
          <h1 className="intro-name-title font-unbounded">
            {NAME_LETTERS.map((char, index) => (
              <span
                key={index}
                className="intro-char intro-letter"
                data-char={char}
              >
                {char}
              </span>
            ))}
            <span className="intro-char intro-dot">.</span>
          </h1>
        </div>

        <p className="intro-subtitle font-mono">
          <span className="intro-subtitle-divider" aria-hidden="true" />
          <span>CREATIVE DEVELOPER</span>
          <span className="intro-subtitle-divider" aria-hidden="true" />
        </p>
      </div>
    );
  }
);

IntroTypography.displayName = "IntroTypography";
export default IntroTypography;
