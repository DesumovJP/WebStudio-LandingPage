"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button, Paper, Box, Dialog, Accordion, AccordionSummary, AccordionDetails, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Testimonials from "@/components/Testimonials";
import Reveal from "@/components/Reveal";
import { useState, useCallback, FormEvent } from "react";
import React from "react";
import { useDict } from "@/i18n/DictContext";
import { getImageUrl } from "@/utils/urls";

type Project = { title: string; sub: string; desc: string };

export default function Home() {
  const { dict } = useDict();
  const projects = (dict?.projects ?? []) as Array<{
    title: string; sub: string; desc: string;
    done: string[]; benefits: string[]; outcome: string;
    metric?: string; stack?: string[];
  }>;
  const petProjects = (dict?.petProjects ?? []) as Array<Project & { stack?: string[] }>;
  const processSteps = (dict?.process ?? []) as Array<{
    num: string; name: string; title: string; desc: string;
  }>;

  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Project | null>(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const handleOpen = (p: Project) => { setCurrent(p); setOpen(true); setCurrentImageIndex(0); };
  const handleClose = () => { setOpen(false); setCurrentImageIndex(0); };
  
  // Generate placeholder images array for gallery (6 images per project)
  // Using placeholder SVG instead of external service for better performance
  const galleryImages = current ? Array(6).fill(null).map((_, i) => `https://res.cloudinary.com/deirtcyfx/image/upload/v1762340442/BCO_3fad0425_6f07_40a7_b899_ded8c4577134_f880591694.png`) : [];
  
  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setImageModalOpen(true);
  };
  
  const handleCloseImageModal = () => {
    setImageModalOpen(false);
  };
  
  const handlePrevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
  }, [galleryImages.length]);
  
    const handleNextImage = useCallback(() => {
      setCurrentImageIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
    }, [galleryImages.length]);

    // Contact form state
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      company: '',
      about: '',
    });
    const [formStatus, setFormStatus] = useState<{
      type: 'idle' | 'loading' | 'success' | 'error';
      message: string;
    }>({ type: 'idle', message: '' });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      
      // Валідація
      if (!formData.name?.trim() || !formData.email?.trim() || !formData.about?.trim()) {
        setFormStatus({
          type: 'error',
          message: dict?.contact?.form?.validationError ?? 'Please fill in all required fields',
        });
        return;
      }

      // Email валідація
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const trimmedEmail = formData.email.trim();
      if (!emailRegex.test(trimmedEmail)) {
        setFormStatus({
          type: 'error',
          message: dict?.contact?.form?.emailError ?? 'Please enter a valid email address',
        });
        return;
      }

      // Sanitize input (basic XSS protection)
      const sanitizedData = {
        name: formData.name.trim().slice(0, 100),
        email: trimmedEmail.slice(0, 254),
        company: formData.company.trim().slice(0, 100),
        about: formData.about.trim().slice(0, 5000),
      };

      setFormStatus({ type: 'loading', message: '' });

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(sanitizedData),
        });

        const data = await response.json();

        if (response.ok) {
          setFormStatus({
            type: 'success',
            message: dict?.contact?.form?.success ?? 'Message sent successfully!',
          });
          // Очистити форму
          setFormData({
            name: '',
            email: '',
            company: '',
            about: '',
          });
          // Сховати повідомлення через 5 секунд
          setTimeout(() => {
            setFormStatus({ type: 'idle', message: '' });
          }, 5000);
        } else {
          setFormStatus({
            type: 'error',
            message: data.error || (dict?.contact?.form?.error ?? 'Failed to send message. Please try again.'),
          });
        }
      } catch (error) {
        setFormStatus({
          type: 'error',
          message: dict?.contact?.form?.error ?? 'Failed to send message. Please try again.',
        });
      }
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
    if (!imageModalOpen) return;
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevImage();
      } else if (e.key === 'ArrowRight') {
        handleNextImage();
      } else if (e.key === 'Escape') {
        handleCloseImageModal();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [imageModalOpen, handlePrevImage, handleNextImage]);

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
            <h1 className="heading-xl">{dict?.hero?.title ?? '...'}</h1>
            <p className="body-lg mt-3 w-72">{dict?.hero?.desc ?? ''}</p>
            <div className="flex row gap-3 mt-3 hero-services">
              {(dict?.hero?.services ?? []).map((s: string, idx: number) => (
                <React.Fragment key={s + idx}>
                  {idx > 0 ? <span className="body-md hero-services-sep">•</span> : null}
                  <span className="body-md">{s}</span>
                </React.Fragment>
              ))}
            </div>
            <div className="flex row gap-2 mt-4">
              <Button href="#contact" variant="contained" className="btn-lg">{dict?.nav?.contactCta ?? 'Start a project'}</Button>
              <Button href="#work" variant="outlined" className="glass btn-lg">{dict?.nav?.viewWork ?? 'View work'}</Button>
            </div>
          </div>
        </section>

        {/* Services */}
        <Reveal>
          <section className="section services-section" id="services">
          <div className="container grid grid-3">
            <div className="service-item pink">
              <h2 className="heading-lg">{dict?.servicesBlock?.full?.title ?? 'Turnkey'}</h2>
              <p className="body-lg">{dict?.servicesBlock?.full?.desc ?? ''}</p>
            </div>
            <div className="service-item green">
              <h2 className="heading-lg">{dict?.servicesBlock?.fast?.title ?? 'Fast start'}</h2>
              <p className="body-lg">{dict?.servicesBlock?.fast?.desc ?? ''}</p>
            </div>
            <div className="service-item yellow">
              <h2 className="heading-lg">{dict?.servicesBlock?.scale?.title ?? 'Scale'}</h2>
              <p className="body-lg">{dict?.servicesBlock?.scale?.desc ?? ''}</p>
            </div>
          </div>
        </section>
        </Reveal>

        {/* Projects Preview */}
        <Reveal>
          <section className="section" id="work">
            <div className="container">
              <h2 className="heading-lg">{dict?.sections?.lastProjects ?? '...'}</h2>
              <div className="grid grid-3 mt-3">
                {projects.map((p, i) => (
                  <Paper key={i} className="glass card project click" elevation={0} onClick={() => handleOpen(p)}>
                    <div className="project-card">
                      <img src="https://res.cloudinary.com/deirtcyfx/image/upload/v1762340442/BCO_3fad0425_6f07_40a7_b899_ded8c4577134_f880591694.png" alt={p.title} className="project-card-img" />
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
                            <span key={idx} className={`stack-tag stack-tag-${tech.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}>{tech}</span>
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
            <h2 className="heading-md">{dict?.sections?.petProjects ?? '...'}</h2>
            <div className="grid grid-3 mt-2">
              {petProjects.map((p, i) => (
                <Paper key={i} className="glass card project click" elevation={0} onClick={() => handleOpen(p)}>
                  <div className="project-card">
                    <img src="https://res.cloudinary.com/deirtcyfx/image/upload/v1762340442/BCO_3fad0425_6f07_40a7_b899_ded8c4577134_f880591694.png" alt={p.title} className="project-card-img" />
                  </div>
                  <div className="card-body">
                    <div className="card-title">{p.title}</div>
                    <div className="card-sub">{p.sub}</div>
                    {p.stack && (
                      <div className="project-stack mt-2">
                        {p.stack.map((tech, idx) => (
                          <span key={idx} className={`stack-tag stack-tag-${tech.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/\//g, '-')}`}>{tech}</span>
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

        {/* Process */}
        <Reveal>
          <section className="section process-section" id="process">
          <div className="container z-1">
            <h2 className="heading-lg text-center">{dict?.sections?.howWeWork ?? '...'}</h2>
            <div className="mt-4">
              <div className="steps-grid">
                {processSteps.map((step, idx) => {
                  const icons = [
                    <svg key="1" className="step-icon" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5"><circle cx="11" cy="11" r="6"/><path d="M16 16l5 5"/></svg>,
                    <svg key="2" className="step-icon" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5"><path d="M3 17.25V21h3.75L19.81 7.94l-3.75-3.75L3 17.25z"/><path d="M14.06 4.19l3.75 3.75"/></svg>,
                    <svg key="3" className="step-icon" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5"><path d="M8 5L3 12l5 7"/><path d="M16 5l5 7-5 7"/></svg>,
                    <svg key="4" className="step-icon" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5"><path d="M5 19l4-1 6-6a5 5 0 10-7-7L2 11l-1 4 4-1z"/><path d="M14 10l-4-4"/><path d="M6 22s1-3 4-4"/></svg>,
                  ];
                  return (
                    <div key={idx} className="step-card">
                      <div className="step-num-row"><span className="step-badge">{step.num}</span><div className="step-num">{step.name}</div></div>
                      <div className="step-title-row">
                        <div className="step-title">{step.title}</div>
                        {icons[idx]}
                      </div>
                      <div className="step-desc">{step.desc}</div>
                    </div>
                  );
                })}
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
              <h2 className="heading-lg pricing-title-main">{dict?.sections?.pricing?.title ?? ''}</h2>
              <p className="body-lg mt-2 pricing-subtitle">{dict?.sections?.pricing?.subtitle ?? ''}</p>
            </div>
            <div className="grid grid-3 mt-4 pricing-grid">
              {(dict?.pricing ?? []).map((p: any, i: number) => (
                <Paper key={i} className={`glass card pricing-card pricing-card-${i === 0 ? 'blue' : i === 1 ? 'green' : 'gold'}`} elevation={0}>
                  <div className="card-body">
                    {i === 1 ? <span className="badge">
                      <svg className="badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M12 2l2.5 7.5 7.5.6-5.8 4.5 1.9 7.1-6.1-4-6.1 4 1.9-7.1-5.8-4.5 7.5-.6L12 2z" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {dict?.sections?.pricing?.popularBadge ?? 'Popular'}
                    </span> : null}
                    <div className="pricing-title-row">
                      <div className="pricing-name">
                        <div className={`card-title ${i === 0 ? 'pricing-blue' : i === 1 ? 'pricing-green' : 'pricing-gold'}`}>{p.title}</div>
                        <span
                          className={`pricing-emoji ${i === 0 ? 'emoji-blue' : i === 1 ? 'emoji-clover' : 'emoji-crown'}`}
                          aria-hidden="true"
                        >
                          {i === 1 ? '🍀' : i === 2 ? '👑' : '✔︎'}
                        </span>
                      </div>
                    </div>
                    <div className="pricing-subtitle-row">
                      <div className="price">{p.price}</div>
                      <div className="pricing-time"><small>{p.time}</small></div>
                    </div>
                    {p.subtitle && <div className="pricing-plan-subtitle">{p.subtitle}</div>}
                    <div className="card-sub mt-2">{p.desc}</div>
                    <div className="features">
                      {(p.features ?? []).map((f: string, idx: number) => (
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
              <h2 className="heading-lg text-center">{dict?.sections?.faq?.title ?? ''}</h2>
              <p className="body-lg text-center faq-subtitle">{dict?.sections?.faq?.subtitle ?? ''}</p>
            </div>
            <div className="faq-grid mt-4">
              {(dict?.faq ?? []).map((item: any, i: number) => (
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
            <h2 className="heading-lg text-center">{dict?.sections?.contact?.title ?? ''}</h2>
            <p className="body-lg mt-2 text-center">{dict?.sections?.contact?.subtitle ?? ''}</p>
            <div className="contact-grid mt-3">
              <div>
                <div className="contact-image-wrap">
                  <img src={getImageUrl('https://res.cloudinary.com/deirtcyfx/image/upload/v1762339091/cat_computer_5b22250514.gif')} alt="cat" className="contact-hero-img" />
                  <div className="contact-overlay">
                    <h3 className="heading-md">{dict?.sections?.contact?.now ?? ''}</h3>
                  </div>
                </div>
              </div>
            <Paper className="paper-clear contact-form-wrap" elevation={0}>
              <div className="modal-content pad-0">
                <form className="form" onSubmit={handleSubmit}>
                  <div className="form-grid">
                    <input
                      className="mui-reset"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder={dict?.contact?.form?.name ?? 'Name'}
                      required
                      disabled={formStatus.type === 'loading'}
                    />
                    <input
                      className="mui-reset"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={dict?.contact?.form?.email ?? 'Email'}
                      required
                      disabled={formStatus.type === 'loading'}
                    />
                    <input
                      className="mui-reset full"
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder={dict?.contact?.form?.company ?? 'Company / Niche'}
                      disabled={formStatus.type === 'loading'}
                    />
                    <textarea
                      className="mui-reset full"
                      name="about"
                      value={formData.about}
                      onChange={handleInputChange}
                      placeholder={dict?.contact?.form?.about ?? 'Briefly about the task'}
                      rows={2}
                      required
                      disabled={formStatus.type === 'loading'}
                    ></textarea>
                    {formStatus.message && (
                      <div className={`form-status ${formStatus.type === 'success' ? 'form-status-success' : formStatus.type === 'error' ? 'form-status-error' : ''}`}>
                        {formStatus.message}
                      </div>
                    )}
                    <div className="full justify-center">
                      <Button
                        type="submit"
                        variant="contained"
                        className="btn-lg"
                        disabled={formStatus.type === 'loading'}
                      >
                        {formStatus.type === 'loading' ? (dict?.contact?.form?.sending ?? 'Sending...') : (dict?.contact?.form?.send ?? 'Send')}
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </Paper>
        </div>
            <div className="contact-telegram text-center mt-4">
              <img
                src={getImageUrl('https://res.cloudinary.com/deirtcyfx/image/upload/v1762338789/pawukpng_42af27088a.png')}
                alt="Webbie logo"
                className="contact-logo"
              />
              <p className="body-md contact-telegram-text">{dict?.sections?.contact?.telegram ?? ''}</p>
              <Button 
                href="https://t.me/desumov" 
            target="_blank"
            rel="noopener noreferrer"
                variant="contained"
                className="telegram-button"
              >
                {dict?.sections?.contact?.button ?? 'Ping'}
              </Button>
            </div>
          </div>
        </section>
        </Reveal>
        {/* Modal */}
        <Dialog open={open} onClose={handleClose} maxWidth={false} disableScrollLock={false} PaperProps={{ className: "modal-paper" }} BackdropProps={{ sx: { backdropFilter: 'blur(1rem)', backgroundColor: 'rgba(0,0,0,0.18)' } }}>
          <div className="modal-content">
            <IconButton 
              onClick={handleClose} 
              className="modal-close-btn"
              aria-label="close"
              sx={{ 
                position: 'absolute', 
                top: '2rem', 
                right: '2rem', 
                zIndex: 10,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(0.8rem)',
                width: '3.5rem',
                height: '3.5rem',
                fontSize: '1.75rem',
                '&:hover': { background: 'rgba(255, 255, 255, 1)', transform: 'scale(1.1)' },
                transition: 'all 200ms ease'
              }}
            >
              <CloseIcon sx={{ fontSize: '1.75rem' }} />
            </IconButton>
            <div className="modal-title">{current?.title}</div>
            <div className="modal-desc">{current?.desc}</div>
            <div className="modal-grid mt-3">
              <div className="modal-left">
                {current && (
                  <>
                    {projects.find(p => p.title === current.title)?.stack && (
                      <div className="modal-section">
                        <h3>{dict?.modal?.techStack ?? 'Tech stack'}</h3>
                        <div className="project-stack modal-stack">
                          {projects.find(p => p.title === current.title)?.stack?.map((tech, idx) => (
                            <span key={idx} className={`stack-tag stack-tag-${tech.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/\//g, '-')}`}>{tech}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="modal-section">
                      <h3>{dict?.modal?.done ?? 'What we did'}</h3>
                      <div className="modal-list">
                        {(projects.find(p => p.title === current.title)?.done || []).map((d, i) => (<div key={i}>— {d}</div>))}
                      </div>
                    </div>
                    <div className="modal-section">
                      <h3>{dict?.modal?.benefits ?? 'Business benefits'}</h3>
                      <div className="modal-list">
                        {(projects.find(p => p.title === current.title)?.benefits || []).map((b, i) => (<div key={i}>— {b}</div>))}
                      </div>
                    </div>
                    <div className="modal-section">
                      <h3>{dict?.modal?.result ?? 'Outcome'}</h3>
                      <div className="modal-list">
                        <div>{projects.find(p => p.title === current.title)?.outcome}</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="modal-right">
                <div className="gallery-grid">
                  {galleryImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="gallery-item"
                      onClick={() => handleImageClick(idx)}
                    >
                      <img src={img} alt={`${current?.title} - Image ${idx + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
        </div>
        </Dialog>
        
        {/* Image Detail Modal */}
        <Dialog 
          open={imageModalOpen} 
          onClose={handleCloseImageModal} 
          maxWidth={false} 
          disableScrollLock={false} 
          PaperProps={{ className: "image-modal-paper" }} 
          BackdropProps={{ sx: { backdropFilter: 'blur(1rem)', backgroundColor: 'rgba(0,0,0,0.85)' } }}
        >
          <div className="image-modal-content">
            <IconButton 
              onClick={handleCloseImageModal} 
              className="image-modal-close-btn"
              aria-label="close"
              sx={{ 
                position: 'fixed', 
                top: '2rem', 
                right: '2rem', 
                zIndex: 10,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(0.8rem)',
                width: '3.5rem',
                height: '3.5rem',
                fontSize: '1.75rem',
                '&:hover': { background: 'rgba(255, 255, 255, 1)', transform: 'scale(1.1)' },
                transition: 'all 200ms ease'
              }}
            >
              <CloseIcon sx={{ fontSize: '1.75rem' }} />
            </IconButton>
            {galleryImages.length > 0 && (
              <>
                <img 
                  src={galleryImages[currentImageIndex]} 
                  alt={`${current?.title} - Image ${currentImageIndex + 1}`}
                  className="image-modal-img"
                />
                <button className="image-modal-nav image-modal-nav-prev" onClick={handlePrevImage} aria-label="Previous image">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <button className="image-modal-nav image-modal-nav-next" onClick={handleNextImage} aria-label="Next image">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                </button>
                <div className="image-modal-counter">{currentImageIndex + 1} / {galleryImages.length}</div>
                <div className="image-modal-hint">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                    <line x1="12" y1="18" x2="12.01" y2="18"/>
                  </svg>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-icon">
                    <path d="M21.5 2v6h-6M2.5 22v-6h6M22 12a10 10 0 0 0-10-10M2 12a10 10 0 0 0 10 10"/>
                  </svg>
                </div>
              </>
            )}
          </div>
        </Dialog>
      </main>
      <Footer />
    </>
  );
}
