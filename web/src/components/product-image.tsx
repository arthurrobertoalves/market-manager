"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function ProductImage({
  src,
  alt,
  className,
}: {
  src: string | null | undefined;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-md bg-muted text-muted-foreground",
          className,
        )}
        aria-label={alt}
      >
        <span className="text-lg">📦</span>
      </div>
    );
  }

  return (
    // Fotos vêm de URL externa arbitrária (cadastro do produto); next/image exigiria
    // configurar remotePatterns por domínio, o que não se aplica aqui.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={cn("rounded-md object-cover", className)}
    />
  );
}
