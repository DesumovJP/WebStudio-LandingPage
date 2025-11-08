"use client";

import Image, { ImageProps } from "next/image";
import { getImageUrl } from "@/utils/urls";
import { fixStrapiUrl } from "@/utils/fixStrapiUrl";
import React from "react";

type StrapiImageProps = Omit<ImageProps, "src"> & {
  src?: string;
  fallbackSrc?: string;
  useImg?: boolean; // fallback to plain <img>
};

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
    // If it's already a Cloudinary URL, use it directly without transformation
    if (src && (src.startsWith('https://res.cloudinary.com') || src.startsWith('http://res.cloudinary.com'))) {
      return src;
    }
    const resolved = getImageUrl(src, fallbackSrc);
    return fixStrapiUrl(resolved);
  }, [src, fallbackSrc]);

  if (useImg) {
    return (
      <img
        src={computed}
        alt={alt}
        className={className}
        loading="lazy"
        decoding="async"
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
      loading={priority ? undefined : 'lazy'}
      unoptimized={unoptimized}
      {...rest}
    />
  );
}
