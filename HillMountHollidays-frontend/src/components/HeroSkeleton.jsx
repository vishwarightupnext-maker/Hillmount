import { useEffect, useState } from "react";

/* Tracks when a background image URL has finished loading */
export const useImageLoaded = (src) => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!src) return;
    setLoaded(false);
    const img = new Image();
    img.onload = () => setLoaded(true);
    img.onerror = () => setLoaded(true); // fail open — never block the page
    img.src = src;
    return () => { img.onload = null; img.onerror = null; };
  }, [src]);
  return loaded;
};

/* Pulsing overlay shown over a hero/banner until its image loads.
   Parent must be `relative`. */
const HeroSkeleton = ({ show }) =>
  show ? (
    <div className="absolute inset-0 z-20 skeleton-shimmer pointer-events-none" />
  ) : null;

export default HeroSkeleton;
