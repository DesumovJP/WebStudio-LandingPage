"use client";

import React from "react";
import { Fade, Box } from "@mui/material";
import { useDict } from "@/i18n/DictContext";

export default function Testimonials() {
  const { dict } = useDict();
  const testimonials = (dict?.testimonials ?? []) as Array<{
    quote: string;
    author: string;
    role: string;
    avatar?: string;
  }>;

  const [index, setIndex] = React.useState(0);
  const next = React.useCallback(() => {
    setIndex((i) => (i + 1) % testimonials.length);
  }, [testimonials.length]);

  React.useEffect(() => {
    if (testimonials.length === 0) return;
    const id = setInterval(next, 5000); // every 5s
    return () => clearInterval(id);
  }, [next, testimonials.length]);

  if (testimonials.length === 0) return null;

  const t = testimonials[index];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Box className="glass" sx={{ borderRadius: "2rem" }}>
      <div className="testimonial">
        <Fade key={index} in timeout={800}>
          <div>
            <div className="testimonial-avatar">
              <img src={t.avatar || "http://localhost:1337/uploads/18aa2193a8b51fc53eab132c88c743f0_e7c81962dc.jpg"} alt={t.author} />
            </div>
            <p className="testimonial-quote">"{t.quote}"</p>
            <p className="testimonial-author">— {t.author}<span className="testimonial-role"> -  {t.role}</span></p>
          </div>
        </Fade>
      </div>
    </Box>
  );
}


