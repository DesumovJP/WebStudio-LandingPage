"use client";

import React from "react";
import { Fade, Box } from "@mui/material";

const TESTIMONIALS: Array<{ quote: string; author: string; role: string; avatar?: string }> = [
  {
    quote:
      "Webbie зібрали MVP за кілька тижнів. Ми одразу почали приймати заявки та тестувати гіпотези.",
    author: "Марко Д.",
    role: "Фаундер маркетплейсу",
    avatar: "http://localhost:1337/uploads/pngtree_cat_operating_laptop_png_image_15881120_46b9855a33.png",
  },
  {
    quote:
      "Швидкий сайт + технічне SEO = стабільний органічний трафік. Команда тримала нас у курсі щотижневими демо.",
    author: "Оксана П.",
    role: "CMO e‑commerce",
    avatar: "http://localhost:1337/uploads/memi_klev_club_8ceo_p_memi_kot_za_noutbukom_4_2bb025c5bd.jpg",
  },
  {
    quote:
      "Дизайн‑система виглядає преміально і не гальмує розробку. Комунікація — прозора, без сюрпризів.",
    author: "Ілля Р.",
    role: "Head of Product",
    avatar: "http://localhost:1337/uploads/marcel_friedrich_XC_28_Kk25_F0_unsplash_e981c3f3ac.jpg",
  },
  {
    quote:
      "Запустили лендінг, підключили аналітику й CRM. Конверсія з мобайл приємно здивувала.",
    author: "Анна К.",
    role: "Маркетолог подій",
    avatar: "http://localhost:1337/uploads/18aa2193a8b51fc53eab132c88c743f0_e7c81962dc.jpg",
  },
  {
    quote:
      "Після редизайну швидкість сайту зросла, а звернень стало більше. Рекомендуємо Webbie.",
    author: "Роман С.",
    role: "Співвласник бренду",
    avatar: "http://localhost:1337/uploads/marcel_friedrich_XC_28_Kk25_F0_unsplash_e981c3f3ac.jpg",
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
            <p className="testimonial-author">— {t.author}<span className="testimonial-role"> -  {t.role}</span></p>
          </div>
        </Fade>
      </div>
    </Box>
  );
}


