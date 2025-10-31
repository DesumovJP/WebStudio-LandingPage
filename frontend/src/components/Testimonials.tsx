"use client";

import React from "react";
import { Fade, Box } from "@mui/material";

const TESTIMONIALS: Array<{ quote: string; author: string; role: string; avatar?: string }> = [
  {
    quote:
      "Webbie зібрали MVP за кілька тижнів. Ми одразу почали приймати заявки та тестувати гіпотези.",
    author: "Марко Д.",
    role: "Фаундер маркетплейсу",
  },
  {
    quote:
      "Швидкий сайт + технічне SEO = стабільний органічний трафік. Команда тримала нас у курсі щотижневими демо.",
    author: "Оксана П.",
    role: "CMO e‑commerce",
  },
  {
    quote:
      "Дизайн‑система виглядає преміально і не гальмує розробку. Комунікація — прозора, без сюрпризів.",
    author: "Ілля Р.",
    role: "Head of Product",
  },
  {
    quote:
      "Запустили лендінг, підключили аналітику й CRM. Конверсія з мобайл приємно здивувала.",
    author: "Анна К.",
    role: "Маркетолог подій",
  },
  {
    quote:
      "Після редизайну швидкість сайту зросла, а звернень стало більше. Рекомендуємо Webbie.",
    author: "Роман С.",
    role: "Співвласник бренду",
  },
];

export default function Testimonials() {
  const [index, setIndex] = React.useState(0);
  const next = React.useCallback(() => {
    setIndex((i) => (i + 1) % TESTIMONIALS.length);
  }, []);

  React.useEffect(() => {
    const id = setInterval(next, 5000); // every 5s
    return () => clearInterval(id);
  }, [next]);

  const t = TESTIMONIALS[index];

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
            <p className="testimonial-author">— {t.author}<span className="testimonial-role">, {t.role}</span></p>
          </div>
        </Fade>
      </div>
    </Box>
  );
}


