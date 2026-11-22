import React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "rectangular" | "circular" | "rounded" | "text";
  width?: string | number;
  height?: string | number;
  className?: string;
}

export default function Skeleton({
  variant = "rounded",
  width,
  height,
  className = "",
  style,
  ...props
}: SkeletonProps) {
  const getVariantClass = () => {
    switch (variant) {
      case "circular":
        return "rounded-full";
      case "rectangular":
        return "rounded-none";
      case "text":
        return "rounded h-4 my-1";
      case "rounded":
      default:
        return "rounded-xl";
    }
  };

  return (
    <div
      className={`skeleton relative overflow-hidden bg-white/[0.04] border border-white/5 ${getVariantClass()} ${className}`}
      style={{
        width,
        height,
        ...style,
      }}
      aria-hidden="true"
      {...props}
    />
  );
}
