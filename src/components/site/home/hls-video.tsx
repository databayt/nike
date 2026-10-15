"use client";

import { useEffect, useRef } from "react";

interface HlsVideoProps {
  src: string;
  label: string;
  className?: string;
}

/**
 * Ambient campaign film — muted, looping, inline. nike.com serves its homepage
 * films as HLS manifests only: Safari plays them natively, everything else goes
 * through hls.js (loaded on demand so it never weighs on first paint). Playback
 * starts once the film scrolls near the viewport and pauses when it leaves, and
 * never auto-plays under `prefers-reduced-motion`.
 */
export default function HlsVideo({ src, label, className }: HlsVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    let destroy: (() => void) | undefined;
    let attached = false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const attach = async () => {
      if (attached) return;
      attached = true;
      // React doesn't reliably reflect `muted`; autoplay needs it set for real.
      video.muted = true;
      // play() right after attach races the source; autoplay starts it once
      // the first fragment is buffered.
      video.autoplay = !reduced;
      // hls.js first wherever MediaSource exists (newer Chromium also claims
      // native HLS via canPlayType but won't start it); native is the
      // Safari/iOS fallback.
      const { default: Hls } = await import("hls.js");
      if (!Hls.isSupported()) {
        if (video.canPlayType("application/vnd.apple.mpegurl")) video.src = src;
        return;
      }
      const hls = new Hls({ capLevelToPlayerSize: true, startLevel: -1 });
      hls.loadSource(src);
      hls.attachMedia(video);
      destroy = () => hls.destroy();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void attach().then(() => {
            if (!reduced) void video.play().catch(() => {});
          });
        } else {
          video.pause();
        }
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(video);

    return () => {
      observer.disconnect();
      destroy?.();
    };
  }, [src]);

  return (
    <video
      ref={ref}
      aria-label={label}
      className={className}
      muted
      loop
      playsInline
      preload="none"
      disablePictureInPicture
    />
  );
}
