"use client";

import Link from "next/link";
import { AppBar, Toolbar, Button, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { useDict } from "@/i18n/DictContext";
// Cloudinary logo URL - using directly to avoid any URL transformation
const LOGO_URL = 'https://res.cloudinary.com/deirtcyfx/image/upload/v1762338789/pawukpng_42af27088a.png';

export default function Header() {
  const { dict } = useDict();
  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  
  const toggle = (v: boolean) => () => {
    if (v) {
      setOpen(true);
      setIsClosing(false);
    } else {
      setIsClosing(true);
      setTimeout(() => {
        setOpen(false);
        setIsClosing(false);
      }, 150);
    }
  };

  useEffect(() => {
    if (open && !isClosing) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, isClosing]);
  const pathname = usePathname() || "/";
  const parts = pathname.split("/");
  const currentLocale = ["uk", "en"].includes(parts[1]) ? parts[1] : undefined;
  const items = [
    { href: "#work", label: dict?.nav?.work ?? "Work" },
    { href: "#services", label: dict?.nav?.services ?? "Services" },
    { href: "#process", label: dict?.nav?.process ?? "Process" },
    { href: "#contact", label: dict?.nav?.contact ?? "Contact" },
  ];
  return (
    <AppBar position="sticky" color="transparent" elevation={0} className="header">
      <Toolbar className="container header-toolbar">
        <Link href={`/${currentLocale ?? ''}` || '/uk'} aria-label="Studio brand" className="brand heading-lg brand-wrap header-left">
          <img src={LOGO_URL} alt="Webbie logo" className="brand-logo" />
          <span>{dict?.nav?.brand ?? 'Webbie'}</span>
        </Link>
        <nav className="nav nav-desktop">
          {items.slice(0,3).map((i) => (
            <Button key={i.href} href={i.href} color="inherit">{i.label}</Button>
          ))}
          <Button href="#contact" color="inherit" variant="outlined" className="glass">{dict?.nav?.contact ?? 'Contact'}</Button>
          <LanguageSwitcher />
        </nav>
        <div className="nav-mobile">
          <LanguageSwitcher />
          <IconButton color="inherit" aria-label="menu" onClick={toggle(true)}>
            <MenuIcon />
          </IconButton>
        </div>
        {/* Mobile Menu Modal */}
        {open && (
          <>
            <div className={`mobile-menu-overlay ${isClosing ? 'closing' : ''}`} onClick={toggle(false)}></div>
            <div className={`mobile-menu-modal ${isClosing ? 'closing' : ''}`}>
              <div className="mobile-menu-header">
                <IconButton aria-label="close" onClick={toggle(false)} className="mobile-menu-close">
                  <CloseIcon />
                </IconButton>
              </div>
              <nav className="mobile-menu-nav">
                {items.map((i) => (
                  <a
                    key={i.href}
                    href={i.href}
                    onClick={toggle(false)}
                    className="mobile-menu-item"
                  >
                    {i.label}
                  </a>
                ))}
              </nav>
            </div>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}


