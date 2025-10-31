"use client";

import { Fade } from "@mui/material";
import React from "react";

type RevealProps = {
  children: React.ReactNode;
  threshold?: number;
  durationMs?: number;
};

export default function Reveal({ children, threshold = 0.1, durationMs = 450 }: RevealProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (!ref.current) return;
    const node = ref.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <Fade in={visible} timeout={durationMs} appear>
      <div ref={ref}>{children}</div>
    </Fade>
  );
}


