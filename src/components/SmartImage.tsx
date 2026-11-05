import { useState } from "react";
import { ImageOff } from "lucide-react";

type Props = { src: string; alt: string; className?: string; eager?: boolean };

export default function SmartImage({
  src,
  alt,
  className = "",
  eager = false,
}: Props) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  return (
    <div
      className={`smart-image ${loaded || failed ? "is-loaded" : ""} ${className}`}
    >
      {!loaded && !failed && (
        <div className="image-skeleton" aria-hidden="true" />
      )}
      {failed ? (
        <div className="image-fallback">
          <ImageOff size={28} />
          <span>{alt}</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={eager ? "high" : "auto"}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
