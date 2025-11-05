"use client";

import Image, { ImageProps } from "next/image";
import { getImageUrl } from "@/utils/urls";
import React from "react";

type StrapiImageProps = Omit<ImageProps, "src"> & {
  src?: string;
  fallbackSrc?: string;
  useImg?: boolean; // fallback to plain <img>
};

function normalizeUrl(url: string): string {
  if (!url) return url;
  // strip locale prefixes like /uk/ or /en/
  if (url.startsWith("/uk/")) url = url.replace("/uk/", "/");
  if (url.startsWith("/en/")) url = url.replace("/en/", "/");
  // upgrade http to https
  if (url.startsWith("http://")) return url.replace("http://", "https://");
  return url;
}

export default function StrapiImage({
  src,
  alt,
  width,
  height,
  className,
  fallbackSrc = "/landing-placeholder.svg",
  useImg,
  priority,
  unoptimized,
  ...rest
}: StrapiImageProps) {
  const computed = React.useMemo(() => {
    const resolved = getImageUrl(src, fallbackSrc);
    return normalizeUrl(resolved);
  }, [src, fallbackSrc]);

  if (useImg) {
    return (
      <img
        src={computed}
        alt={alt}
        className={className}
        onError={(e) => {
          const target = e.currentTarget as HTMLImageElement;
          if (target.src !== fallbackSrc) target.src = fallbackSrc;
        }}
      />
    );
  }

  // next/image path
  const safeWidth = width ?? 112;
  const safeHeight = height ?? 112;

  return (
    <Image
      src={computed}
      alt={alt}
      width={safeWidth}
      height={safeHeight}
      className={className}
      priority={priority}
      unoptimized={unoptimized}
      {...rest}
    />
  );
}
