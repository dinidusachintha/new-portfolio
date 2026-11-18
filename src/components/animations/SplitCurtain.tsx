import { forwardRef } from "react";
import type React from "react";

export interface SplitCurtainProps {
  topRef: React.RefObject<HTMLDivElement | null>;
  bottomRef: React.RefObject<HTMLDivElement | null>;
  lineRef: React.RefObject<HTMLDivElement | null>;
}

export const SplitCurtain = forwardRef<HTMLDivElement, SplitCurtainProps>(
  ({ topRef, bottomRef, lineRef }, _ref) => {
    return (
      <>
        {/* Top Split Panel */}
        <div ref={topRef} className="intro-curtain-top" aria-hidden="true">
          <div className="intro-curtain-grid" />
        </div>

        {/* Center Expanding Cyan Line */}
        <div ref={lineRef} className="intro-cyan-line" aria-hidden="true" />

        {/* Bottom Split Panel */}
        <div ref={bottomRef} className="intro-curtain-bottom" aria-hidden="true">
          <div className="intro-curtain-grid" />
        </div>
      </>
    );
  }
);

SplitCurtain.displayName = "SplitCurtain";
export default SplitCurtain;
