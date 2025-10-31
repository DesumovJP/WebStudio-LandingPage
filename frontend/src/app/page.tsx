"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button, Paper, Box, Dialog, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import Testimonials from "@/components/Testimonials";
import Reveal from "@/components/Reveal";
import { useState, useCallback } from "react";
import React from "react";

type Project = { title: string; sub: string; desc: string };

export default function Home() {
  const projects: Array<{
    title: string; sub: string; desc: string;
    done: string[]; benefits: string[]; outcome: string;
    metric?: string; stack?: string[];
  }> = [
    {
      title: "Інтернет магазин Чаю + CMS",
      sub: "E-commerce, Headless CMS",
      desc: "Магазин з каталогом, кошиком, оплатою та панеллю керування контентом.",
      done: [
        "UX‑флоу покупки, кошик, швидка оплата",
        "Strapi CMS для товарів, категорій і контентних блоків",
        "Next.js фронтенд з ISR для швидких сторінок",
      ],
      benefits: [
        "Редагування контенту без розробників",
        "Висока швидкість завантаження (Core Web Vitals)",
        "Модульність для розширення каталогу",
      ],
      outcome: "+38% до конверсії та стабільна органіка завдяки технічному SEO.",
      metric: "+38% конверсії",
      stack: ["Next.js", "Strapi", "Stripe", "PostgreSQL", "Zustand", "GraphQL"],
    },
    {
      title: "Landing page Ведучого Корпоративів",
      sub: "Lead‑gen, SEO‑ready",
      desc: "Лендінг з формами заявок, швидким рендерингом та мікроанімаціями.",
      done: ["Сценарій сторінки та копірайт", "Анімації без перевантаження", "Інтеграція форм/CRM"],
      benefits: ["Впізнаваність бренду", "Висока конверсія з мобільних", "Готовність до реклами"],
      outcome: "Ліди з першого тижня запуску та нижча вартість заявки.",
      metric: "Ліди з 1-го тижня",
      stack: ["Next.js", "Framer Motion", "HubSpot", "Strapi", "GraphQL"],
    },
    {
      title: "Модний Маркетплейс — Блог",
      sub: "Контент + каталог, авторизація",
      desc: "Публікації, теги, профілі авторів і старт каталогу товарів.",
      done: ["Схема контенту та ролі", "Авторизація та профілі", "Гнучкі списки/фільтри"],
      benefits: ["Швидка публікація матеріалів", "SEO‑структура", "Готовність під монетизацію"],
      outcome: "Зростання органічного трафіку і часу на сайті.",
      metric: "↑150% органіка",
      stack: ["Next.js", "Strapi", "Auth0", "Redis", "GraphQL", "Crypto Payment APIs", "Zustand"],
    },
    {
      title: "Інтернет магазин квітів + CMS",
      sub: "Швидка покупка, інтеграція оплати",
      desc: "Конфігуратор букетів, швидке оформлення, push‑сповіщення.",
      done: ["Конфігуратор на React", "Stripe/WayForPay", "Нотифікації та трекінг замовлень"],
      benefits: ["Зручний UX", "Менше кроків до покупки", "Легка зміна асортименту"],
      outcome: "Більше повторних замовлень та UGC у соцмережах.",
      metric: "↑45% повторні",
      stack: ["React", "Strapi", "Stripe", "WebPush", "GraphQL", "Zustand"],
    },
    {
      title: "Веб додаток купівлі Авто з США",
      sub: "Агрегація аукціонів",
      desc: "Підбір авто, відстеження ставок, прорахунок логістики і митних платежів.",
      done: ["Імпорт лотів з API", "Калькулятор логістики", "Збереження та стеження за лотами"],
      benefits: ["Економія часу менеджерів", "Менше помилок у прорахунках", "Профілі клієнтів"],
      outcome: "Підвищення ефективності відділу продажів та прозорість для клієнтів.",
      metric: "↑60% ефективність",
      stack: ["Next.js", "Node.js", "PostgreSQL", "GraphQL"],
    },
    {
      title: "Сайт Волонтерської Організації",
      sub: "Звіти та донати",
      desc: "Прозорі звіти, інтеграції донатів, багатомовність.",
      done: ["Сторінки звітів та географії допомоги", "Інтеграція донатів", "Багатомовність"],
      benefits: ["Довіра завдяки прозорості", "Мобільна зручність", "Легкий контент‑менеджмент"],
      outcome: "Зростання регулярних донатів та партнерств.",
      metric: "↑80% донатів",
      stack: ["Next.js", "Strapi", "i18n", "Payment APIs"],
    },
  ];
  const petProjects: Array<Project & { stack?: string[] }> = [
    { title: "Мобільний додаток пошуку роботи на мапі", sub: "React Native, геолокація", desc: "Пошук вакансій поруч на мапі, фільтри, обране та офлайн‑кеш.", stack: ["React Native", "Geolocation API", "Map Integration", "AsyncStorage"] },
    { title: "Захищений VPN Додаток", sub: "Безпека і приватність", desc: "VPN‑клієнт з швидким підключенням, списком локацій і авто‑реконектом.", stack: ["React Native", "OpenVPN Protocol", "TLS/SSL", "Background Services", "Secure Storage"] },
  ];

  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Project | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const handleOpen = (p: Project) => { setCurrent(p); setOpen(true); setCurrentImageIndex(0); };
  const handleClose = () => { setOpen(false); setCurrentImageIndex(0); };
  
  // Generate placeholder images array for gallery (3 images per project)
  const galleryImages = current ? Array(3).fill(null).map((_, i) => `https://picsum.photos/800/600?random=${current.title}-${i}`) : [];
  
  const handlePrevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
  }, [galleryImages.length]);
  
  const handleNextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
  }, [galleryImages.length]);
  
  const handleThumbClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Lock page scroll when modal is open
  React.useEffect(() => {
    if (open) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => document.body.classList.remove("modal-open");
  }, [open]);

  // Keyboard navigation for gallery
  React.useEffect(() => {
    if (!open) return;
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevImage();
      } else if (e.key === 'ArrowRight') {
        handleNextImage();
      } else if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [open, handlePrevImage, handleNextImage]);

  // Smooth scroll for anchor links
  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href^="#"]') as HTMLAnchorElement;
      if (link) {
        const href = link.getAttribute('href');
        if (href && href !== '#') {
          const targetId = href.slice(1);
          const targetEl = document.getElementById(targetId);
          if (targetEl) {
            e.preventDefault();
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="section hero-section" id="hero">
          <div className="container z-1 hero-pad">
            <h1 className="heading-xl">Створюємо веб‑сайти та додатки, що приводять клієнтів</h1>
            <p className="body-lg mt-3 w-72">
              Ми поєднуємо стратегічний дизайн, чистий код і швидкий запуск. Ви отримуєте продукт під ключ: від ідеї та прототипу до розгортання та підтримки.
            </p>
            <div className="flex row gap-3 mt-3 hero-services">
              <span className="body-md">Сайти</span>
              <span className="body-md hero-services-sep">•</span>
              <span className="body-md">Веб‑додатки</span>
              <span className="body-md hero-services-sep">•</span>
              <span className="body-md">Мобільні додатки</span>
              <span className="body-md">(Android & iOS)</span>
            </div>
            <div className="flex row gap-2 mt-4">
              <Button href="#contact" variant="contained">Запустити проєкт</Button>
              <Button href="#work" variant="outlined" className="glass">Дивитися роботи</Button>
            </div>
          </div>
        </section>

        {/* Services */}
        <Reveal>
          <section className="section services-section" id="services">
          <div className="container grid grid-3">
            <div className="service-item pink">
              <h2 className="heading-lg">Під ключ</h2>
              <p className="body-lg">UX/UI, фронтенд, бекенд, інтеграції та аналітика — одна команда, один дедлайн.</p>
            </div>
            <div className="service-item green">
              <h2 className="heading-lg">Швидкий старт</h2>
              <p className="body-lg">Перша версія за тижні, не місяці. Фокусуємося на бізнес‑метриках, а не на зайвих екранах.</p>
            </div>
            <div className="service-item yellow">
              <h2 className="heading-lg">Масштабування</h2>
              <p className="body-lg">Архітектура, готова до зростання: Next.js + Strapi + сучасна інфраструктура.</p>
            </div>
          </div>
        </section>
        </Reveal>

        {/* Projects Preview */}
        <Reveal>
          <section className="section" id="work">
            <div className="container">
              <h2 className="heading-lg">Останні проєкти</h2>
              <div className="grid grid-3 mt-3">
                {projects.map((p, i) => (
                  <Paper key={i} className="glass card project click" elevation={0} onClick={() => handleOpen(p)}>
                    <div className="project-card">
                      <img src="/landing-placeholder.svg" alt={p.title} className="project-card-img" />
                    </div>
                    <div className="card-body">
                      <div className="card-title-row">
                        <div className="card-title">{p.title}</div>
                        {p.metric && <span className="project-metric">{p.metric}</span>}
                      </div>
                      <div className="card-sub">{p.sub}</div>
                      {p.stack && (
                        <div className="project-stack mt-2">
                          {p.stack.map((tech, idx) => (
                            <span key={idx} className="stack-tag">{tech}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Paper>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        {/* Pet Projects */}
        <Reveal>
          <section className="section" id="pet">
          <div className="container">
            <h2 className="heading-md">Пет‑проєкти</h2>
            <div className="grid grid-3 mt-2">
              {petProjects.map((p, i) => (
                <Paper key={i} className="glass card project click" elevation={0} onClick={() => handleOpen(p)}>
                  <div className="project-card">
                    <img src="/landing-placeholder.svg" alt={p.title} className="project-card-img" />
                  </div>
                  <div className="card-body">
                    <div className="card-title">{p.title}</div>
                    <div className="card-sub">{p.sub}</div>
                  </div>
                </Paper>
              ))}
            </div>
          </div>
        </section>
        </Reveal>

        {/* Process */}
        <Reveal>
          <section className="section process-section" id="process">
          <div className="container z-1">
            <h2 className="heading-lg text-center">Як ми працюємо</h2>
            <div className="mt-4">
              <div className="steps-grid">
                <div className="step-card">
                  <div className="step-num-row"><span className="step-badge">1</span><div className="step-num">Дослідження</div></div>
                  <div className="step-title-row">
                    <div className="step-title">Глибоке занурення в бізнес</div>
                    <svg className="step-icon" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5"><circle cx="11" cy="11" r="6"/><path d="M16 16l5 5"/></svg>
                  </div>
                  <div className="step-desc">Інтерв'ю, аналіз конкурентів і пошукових запитів. Формуємо УТП, структуру контенту й SEO‑ядро, щоб клієнти знаходили вас органічно.</div>
                </div>
                <div className="step-card">
                  <div className="step-num-row"><span className="step-badge">2</span><div className="step-num">Дизайн</div></div>
                  <div className="step-title-row">
                    <div className="step-title">Система, що продає</div>
                    <svg className="step-icon" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5"><path d="M3 17.25V21h3.75L19.81 7.94l-3.75-3.75L3 17.25z"/><path d="M14.06 4.19l3.75 3.75"/></svg>
                  </div>
                  <div className="step-desc">Прототипи, дизайн‑система, мінімалістичний UI з фокусом на конверсію. Контент‑гайд і мікроанімації для сучасного відчуття бренду.</div>
                </div>
                <div className="step-card">
                  <div className="step-num-row"><span className="step-badge">3</span><div className="step-num">Розробка</div></div>
                  <div className="step-title-row">
                    <div className="step-title">Найкращі технологічні практики</div>
                    <svg className="step-icon" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5"><path d="M8 5L3 12l5 7"/><path d="M16 5l5 7-5 7"/></svg>
                  </div>
                  <div className="step-desc">Next.js + Strapi, доступність, швидкість, SSG/ISR, аналітика і інтеграції. Чистий код і масштабована архітектура.</div>
                </div>
                <div className="step-card">
                  <div className="step-num-row"><span className="step-badge">4</span><div className="step-num">Запуск і зростання</div></div>
                  <div className="step-title-row">
                    <div className="step-title">SEO та постійна підтримка</div>
                    <svg className="step-icon" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5"><path d="M5 19l4-1 6-6a5 5 0 10-7-7L2 11l-1 4 4-1z"/><path d="M14 10l-4-4"/><path d="M6 22s1-3 4-4"/></svg>
                  </div>
                  <div className="step-desc">Технічна SEO‑оптимізація, розмітка Schema.org, Core Web Vitals, контент‑план. Щотижневі демо та прозорий беклог у спільному тулі.</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        </Reveal>

        {/* Testimonials */}
        <Reveal>
          <section className="section" id="testimonials">
          <div className="container">
            <Testimonials />
          </div>
        </section>
        </Reveal>

        {/* Pricing */}
        <Reveal>
          <section className="section pricing-section" id="pricing">
          <div className="container">
            <div className="pricing-header text-center">
              <h2 className="heading-lg pricing-title-main">Виберіть підхід до вашого продукту</h2>
              <p className="body-lg mt-2 pricing-subtitle">Прозорі ціни без прихованих платежів. Кожен тариф включає підтримку перші 30 днів після запуску.</p>
            </div>
            <div className="grid grid-3 mt-4 pricing-grid">
              {[{
                title: "Starter",
                price: "від 250$",
                time: "до 7 днів",
                subtitle: "Ідеально для тестування ідеї",
                desc: "Мінімалістичний лендінг або односторінковий сайт. Швидкий запуск, чистий код, технічна SEO‑база. Готовність до масштабування.",
                features: [
                  "UX‑прототип та адаптивний дизайн",
                  "Next.js фронтенд з SSG (Core Web Vitals)",
                  "Технічна SEO‑оптимізація",
                  "Мобільна версія з швидким завантаженням",
                  "30 днів технічної підтримки",
                ],
              }, {
                title: "Business",
                price: "від 500$",
                time: "до 3 тижнів",
                subtitle: "Найпопулярніший вибір",
                desc: "Повноцінний сайт або інтернет‑магазин (e‑commerce) з адмін‑панеллю для керування товарами. Авторизація користувачів, інтеграції з платіжними системами, аналітика продажів. Готовність до активного маркетингу.",
                features: [
                  "React + Next.js фронтенд",
                  "Strapi CMS — інтерактивна адмін‑панель",
                  "Авторизація користувачів та права доступу",
                  "Інтеграції: платежі (Stripe/WayForPay), CRM, аналітика",
                  "SEO‑фундамент + контент‑план",
                  "30 днів підтримки + 2 безкоштовні правки",
                ],
              }, {
                title: "Scale",
                price: "від 750$",
                time: "від 3 тижнів",
                subtitle: "Для зростаючого бізнесу",
                desc: "Ентерпрайз‑рівень: дизайн‑система, масштабована архітектура, мобільний додаток. Готовність до мільйонів користувачів.",
                features: [
                  "Гнучка дизайн‑система та компонентна архітектура",
                  "React / React Native фронтенд",
                  "Node.js бекенд + PostgreSQL",
                  "Висока продуктивність, безпека, моніторинг",
                  "API‑first підхід для інтеграцій",
                  "30 днів підтримки + щомісячні консультації",
                ],
              }].map((p, i) => (
                <Paper key={i} className={`glass card pricing-card pricing-card-${i === 0 ? 'blue' : i === 1 ? 'green' : 'gold'}`} elevation={0}>
                  <div className="card-body">
                    {i === 1 ? <span className="badge">
                      <svg className="badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M12 2l2.5 7.5 7.5.6-5.8 4.5 1.9 7.1-6.1-4-6.1 4 1.9-7.1-5.8-4.5 7.5-.6L12 2z" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Popular
                    </span> : null}
                    <div className="pricing-title-row">
                      <div className={`card-title ${i === 0 ? 'pricing-blue' : i === 1 ? 'pricing-green' : 'pricing-gold'}`}>{p.title}</div>
                      {i === 0 && (
                        <svg className="pricing-icon" viewBox="0 0 24 24" fill="none" stroke="#42a5f5" strokeWidth="2"><path d="M5 12l4 4L19 6"/></svg>
                      )}
                      {i === 1 && (
                        <svg className="pricing-icon" viewBox="0 0 24 24" fill="#4caf50">
                          <circle cx="12" cy="9" r="3.5" fill="#4caf50"/>
                          <circle cx="9" cy="12" r="3.5" fill="#4caf50"/>
                          <circle cx="15" cy="12" r="3.5" fill="#4caf50"/>
                          <circle cx="12" cy="15" r="3.5" fill="#4caf50"/>
                        </svg>
                      )}
                      {i === 2 && (
                        <svg className="pricing-icon" viewBox="0 0 24 24" fill="#d4af37"><path d="M3 7l4 5 5-7 5 7 4-5v10H3z"/></svg>
                      )}
                    </div>
                    <div className="pricing-subtitle-row">
                      <div className="price">{p.price}</div>
                      <div className="pricing-time"><small>{p.time}</small></div>
                    </div>
                    {p.subtitle && <div className="pricing-plan-subtitle">{p.subtitle}</div>}
                    <div className="card-sub mt-2">{p.desc}</div>
                    <div className="features">
                      {p.features.map((f, idx) => (
                        <div key={idx} className="feature">
                          <svg className="feature-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12l4 4L19 6"/></svg>
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Paper>
              ))}
            </div>
          </div>
        </section>
        </Reveal>

        {/* FAQ */}
        <Reveal>
          <section className="section" id="faq">
          <div className="container">
            <div className="faq-header">
              <svg className="faq-header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <h2 className="heading-lg text-center">Часті запитання</h2>
              <p className="body-lg text-center faq-subtitle">Відповіді на питання, які часто задають наші клієнти</p>
            </div>
            <div className="faq-grid mt-4">
              {[
                {
                  q: "Скільки часу займає розробка проекту?",
                  a: "Залежить від складності та обсягу робіт: простий лендінг — до 7 днів (Starter), e‑commerce з CMS та адмін‑панеллю — до 3 тижнів (Business), складний продукт з дизайн‑системою — від 3 тижнів (Scale). Після детального аналізу задачі надсилаємо точний план з дедлайнами по кожному етапу: дослідження, дизайн, розробка, тестування, запуск. Кожен проект починається з уточнення вимог та створення технічного завдання, що допомагає уникнути недорозумінь і затримок."
                },
                {
                  q: "Чи можна змінювати контент самостійно після запуску?",
                  a: "Так. У тарифах Business і Scale включена інтерактивна адмін‑панель (Strapi CMS), де ви можете редагувати текст, товари, категорії, блог‑пости, зображення без допомоги розробників. Панель має інтуїтивний інтерфейс, нагадує роботу з документами. Також навчаємо вашу команду працювати з панеллю: проводимо демо‑сесію, надаємо відео‑інструкції та технічну документацію. У Starter тарифі контент можна змінювати через код або за додаткову оплату можна додати базову адмін‑панель."
                },
                {
                  q: "Що входить у технічну підтримку після запуску?",
                  a: "Технічна підтримка включає: оновлення безпеки та залежностей, виправлення помилок та багів, консультації з розвитком продукту, моніторинг Core Web Vitals та продуктивності, SEO‑оптимізацію та аналітику. Перші 30 днів після запуску підтримка включена у всіх тарифах. Далі можна продовжити на місячній основі або за запитом. У тарифі Scale включені щомісячні консультації та пріоритетна підтримка. Деталі підтримки обговорюємо під час старту проекту та зафіксовано у договорі."
                },
                {
                  q: "Як працює SEO‑оптимізація?",
                  a: "Закладаємо SEO‑фундамент з першого дня розробки. Технічна оптимізація включає: SSG/ISR для швидкості завантаження, структуровану розмітку Schema.org для кращого індексування, оптимізацію Core Web Vitals (LCP, FID, CLS), семантичну HTML‑розмітку, правильні мета‑теги та Open Graph. Також надаємо контент‑план і рекомендації для органічного зростання трафіку, прописуємо стратегію ключових слів, налаштовуємо аналітику для відстеження позицій. У Business і Scale тарифах додатково налаштовуємо XML sitemap, robots.txt, та інтегруємо з Google Search Console."
                },
                {
                  q: "Чи працюєте ви з існуючими системами (CRM, платежі)?",
                  a: "Так. Інтегруємо ваш сайт з популярними CRM (HubSpot, Salesforce, Pipedrive), платіжними системами (Stripe, WayForPay, LiqPay, PayPal), аналітикою (Google Analytics, Yandex.Metrika, Mixpanel), email‑маркетингом (Mailchimp, SendGrid), та іншими інструментами вашого бізнесу. Використовуємо REST API та GraphQL для інтеграцій. Якщо у вас кастомна система, розробляємо інтеграцію під ваші вимоги. Всі інтеграції тестуються перед запуском та документуються для вашої команди."
                },
                {
                  q: "Що робити, якщо проект треба масштабувати?",
                  a: "Архітектура з самого початку готова до зростання завдяки використанню сучасних технологій (Next.js, Strapi, PostgreSQL). Можемо додати нові функції, мобільний додаток (React Native для iOS та Android), розширити бекенд, інтегрувати додаткові сервіси, додати мультимовність, реалізувати складні бізнес‑логіки. Масштабування відбувається без переписування коду — ми додаємо нові модулі до існуючої структури. Також можемо оптимізувати продуктивність через кешування, CDN, та горизонтальне масштабування серверів за потреби."
                },
                {
                  q: "Які технології ви використовуєте?",
                  a: "Frontend: Next.js, React, TypeScript для веб‑додатків; React Native для мобільних додатків (iOS та Android). Backend: Node.js, Strapi CMS для адмін‑панелей та контенту, PostgreSQL для баз даних. Інтеграції: GraphQL та REST API. Інфраструктура: Vercel, AWS, або інші платформи за вашими перевагами. Також використовуємо сучасні інструменти: Zustand для стану, Framer Motion для анімацій. Всі технології актуальні, мають велику спільноту та підтримку, що забезпечує довгострокову підтримку проекту."
                },
                {
                  q: "Як виглядає процес роботи над проектом?",
                  a: "Процес поділений на етапи: 1) Дослідження — аналіз бізнес‑задач, конкурентів, цільової аудиторії, формування УТП; 2) Дизайн — прототипи, дизайн‑система, адаптивні макети; 3) Розробка — ітеративна розробка з щотижневими демо; 4) Тестування — перевірка на різних пристроях та браузерах; 5) Запуск — деплой, налаштування, передача доступу. Кожного тижня проводимо демо, де показуємо прогрес, обговорюємо зміни та наступні кроки. Використовуємо Trello або інші інструменти для прозорості процесу. Комунікація відбувається через Telegram або email, залежно від ваших переваг."
                },
                {
                  q: "Скільки коштує проект?",
                  a: "Ціна залежить від обсягу робіт та складності. Стартові тарифи: Starter від 250$ (простий лендінг), Business від 500$ (e‑commerce з CMS), Scale від 750$ (складний продукт). Після опису задачі надаємо детальну кошторис з розбивкою по етапах та можливими опціями. Фінальна ціна фіксується у договорі перед початком робіт. Оплата може бути поетапною (перед початком кожного етапу) або частково перед стартом та перед запуском. Гнучкі умови оплати обговорюються індивідуально."
                }
              ].map((item, i) => (
                <Accordion key={i} className="faq-item" elevation={0} sx={{ backgroundColor: 'transparent', border: 'none', '&:before': { display: 'none' } }}>
                  <AccordionSummary expandIcon={
                    <svg className="faq-expand-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  } className="faq-question">
                    <svg className="faq-question-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                      <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                    <h3 className="faq-q">{item.q}</h3>
                  </AccordionSummary>
                  <AccordionDetails className="faq-answer">
                    <div className="faq-answer-content">
                      <p className="faq-answer-text">— {item.a}</p>
                    </div>
                  </AccordionDetails>
                </Accordion>
              ))}
            </div>
          </div>
        </section>
        </Reveal>

        {/* Contact */}
        <Reveal>
          <section className="section" id="contact">
          <div className="container">
            <h2 className="heading-lg text-center">Готові зростати? Розкажіть про ідею.</h2>
            <p className="body-lg mt-2 text-center">Відповімо протягом 24 годин і надішлемо план запуску з бюджетом.</p>
            <div className="contact-grid mt-3">
              <div>
                <div className="contact-image-wrap">
                  <img src="http://localhost:1337/uploads/cat_computer_9382ba0873.gif" alt="cat" className="contact-hero-img" />
                  <div className="contact-overlay">
                    <h3 className="heading-md">Наша команда прямо зараз:</h3>
                  </div>
                </div>
              </div>
            <Paper className="paper-clear contact-form-wrap" elevation={0}>
              <div className="modal-content pad-0">
                <form className="form">
                  <div className="form-grid">
                    <input className="mui-reset" type="text" placeholder="Ім’я" />
                    <input className="mui-reset" type="email" placeholder="Email" />
                    <input className="mui-reset full" type="text" placeholder="Компанія / Ніша" />
                    <textarea className="mui-reset full" placeholder="Коротко про задачу" rows={2}></textarea>
                    <div className="full justify-center">
                      <Button className="w-25" type="submit" variant="contained">Надіслати</Button>
                    </div>
                  </div>
                </form>
              </div>
            </Paper>
        </div>
            <div className="contact-telegram text-center mt-4">
              <p className="body-md contact-telegram-text">Або пишіть прямо зараз в телеграм</p>
              <Button 
                href="https://t.me/desumov" 
            target="_blank"
            rel="noopener noreferrer"
                variant="contained"
                className="telegram-button"
              >
                Клік
              </Button>
            </div>
          </div>
        </section>
        </Reveal>
        {/* Modal */}
        <Dialog open={open} onClose={handleClose} maxWidth={false} disableScrollLock={false} PaperProps={{ className: "modal-paper" }} BackdropProps={{ sx: { backdropFilter: 'blur(1rem)', backgroundColor: 'rgba(0,0,0,0.18)' } }}>
          <div className="modal-content">
            <div className="modal-title">{current?.title}</div>
            <div className="modal-desc">{current?.desc}</div>
            <div className="modal-grid mt-3">
              <div className="modal-left">
                <div className="gallery">
                  <div className="gallery-hero-wrapper">
                    <img 
                      src={galleryImages[currentImageIndex]} 
                      alt={`${current?.title} - Image ${currentImageIndex + 1}`}
                      className="gallery-hero-img"
                    />
                    <button className="gallery-nav gallery-nav-prev" onClick={handlePrevImage} aria-label="Previous image">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                    </button>
                    <button className="gallery-nav gallery-nav-next" onClick={handleNextImage} aria-label="Next image">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                    </button>
                    <div className="gallery-counter">{currentImageIndex + 1} / {galleryImages.length}</div>
                  </div>
                  <div className="gallery-thumbs">
                    {galleryImages.map((img, idx) => (
                      <button
                        key={idx}
                        className={`thumb ${idx === currentImageIndex ? 'thumb-active' : ''}`}
                        onClick={() => handleThumbClick(idx)}
                        aria-label={`View image ${idx + 1}`}
                      >
                        <img src={img} alt={`Thumbnail ${idx + 1}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="modal-right">
                {current && (
                  <>
                    {projects.find(p => p.title === current.title)?.stack && (
                      <div className="modal-section">
                        <h3>Технологічний стек</h3>
                        <div className="project-stack modal-stack">
                          {projects.find(p => p.title === current.title)?.stack?.map((tech, idx) => (
                            <span key={idx} className="stack-tag">{tech}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="modal-section">
                      <h3>Що було зроблено</h3>
                      <div className="modal-list">
                        {(projects.find(p => p.title === current.title)?.done || []).map((d, i) => (<div key={i}>— {d}</div>))}
                      </div>
                    </div>
                    <div className="modal-section">
                      <h3>Переваги для бізнесу</h3>
                      <div className="modal-list">
                        {(projects.find(p => p.title === current.title)?.benefits || []).map((b, i) => (<div key={i}>— {b}</div>))}
                      </div>
                    </div>
                    <div className="modal-section">
                      <h3>Результат</h3>
                      <div className="modal-list">
                        <div>{projects.find(p => p.title === current.title)?.outcome}</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
        </div>
        </Dialog>
      </main>
      <Footer />
    </>
  );
}
