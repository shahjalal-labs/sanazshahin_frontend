"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

interface RecipeVideoCardProps {
  title: string;
  thumbnail: string;
  videoUrl: string;
  className?: string;
}

const getYouTubeEmbedUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    const resolveVideoId = () => {
      if (host === "youtu.be") {
        return parsed.pathname.split("/").filter(Boolean)[0] ?? null;
      }

      if (host.endsWith("youtube.com")) {
        if (parsed.pathname.startsWith("/watch")) {
          return parsed.searchParams.get("v");
        }

        const match = parsed.pathname.match(
          /^\/(?:embed|shorts|live)\/([^/?#]+)/,
        );

        return match?.[1] ?? parsed.searchParams.get("v");
      }

      return null;
    };

    const videoId = resolveVideoId();
    return videoId
      ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`
      : null;
  } catch {
    return null;
  }
};

export default function RecipeVideoCard({
  title,
  thumbnail,
  videoUrl,
  className,
}: RecipeVideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const embedUrl = useMemo(() => getYouTubeEmbedUrl(videoUrl), [videoUrl]);

  return (
    <div className={`overflow-hidden rounded-[30px] ${className ?? ""}`.trim()}>
      {isPlaying && embedUrl ? (
        <div className="relative w-full overflow-hidden rounded-[30px] bg-black pt-[56.25%]">
          <iframe
            src={embedUrl}
            title={`${title} video`}
            className="absolute left-0 top-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsPlaying(true)}
          className="group relative block w-full overflow-hidden rounded-[30px] text-left"
          aria-label="Play recipe video"
        >
          <div className="relative w-full pt-[125%]">
            <Image
              src={thumbnail}
              alt={`${title} video thumbnail`}
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/30" />
          <span className="absolute left-1/2 top-1/2 inline-flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-600 text-white shadow-xl">
            <Play className="ml-1 h-10 w-10 fill-white" />
          </span>
        </button>
      )}
    </div>
  );
}
