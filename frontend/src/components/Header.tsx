"use client";

import Link from "next/link";
import { AppBar, Toolbar, Button, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState, useCallback } from "react";
import { useDict } from "@/i18n/DictContext";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

export default function Header() {
  const { locale, dict } = useDict();
  const [open, setOpen] = useState(false);
  const toggle = (v: boolean) => () => setOpen(v);
  const items = [
    { href: "#work", label: dict.nav.work },
    { href: "#services", label: dict.nav.services },
    { href: "#process", label: dict.nav.process },
    { href: "#contact", label: dict.nav.contact },
  ];
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const switchLocale = useCallback((target: 'uk' | 'en') => (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const current = pathname || `/${locale}`;
    const rest = current.replace(/^\/(uk|en)/, "");
    const query = searchParams?.toString();
    const href = `/${target}${rest}${query ? `?${query}` : ""}`;
    router.push(href);
    setOpen(false);
  }, [pathname, searchParams, router, locale]);
  return (
    <AppBar position="sticky" color="transparent" elevation={0} className="header">
      <Toolbar className="container header-toolbar">
        <Link href={`/${locale}`} aria-label="Studio brand" className="brand heading-lg brand-wrap header-left">
          <img src="http://localhost:1337/uploads/pawukpng_89b3bd786e.png" alt="Webbie logo" className="brand-logo" />
          <span>{dict.brand}</span>
        </Link>
        <nav className="nav nav-desktop">
          {items.slice(0,3).map((i) => (
            <Button key={i.href} href={`/${locale}${i.href}`} color="inherit">{i.label}</Button>
          ))}
          <Button href={`/${locale}#contact`} color="inherit" variant="outlined" className="glass">{dict.nav.contact}</Button>
          <div className="lang-switch">
            <a className={`lang-btn ${locale === 'uk' ? 'active' : ''}`} href={`/uk`} onClick={switchLocale('uk')}>Укр</a>
            <span className="lang-sep">/</span>
            <a className={`lang-btn ${locale === 'en' ? 'active' : ''}`} href={`/en`} onClick={switchLocale('en')}>Eng</a>
          </div>
        </nav>
        <div className="nav-mobile">
          <IconButton color="inherit" aria-label="menu" onClick={toggle(true)}>
            <MenuIcon />
          </IconButton>
        </div>
        <Drawer anchor="right" open={open} onClose={toggle(false)} classes={{ paper: "drawer-paper" }}>
          <div className="drawer-head">
            <IconButton aria-label="close" onClick={toggle(false)}>
              <CloseIcon />
            </IconButton>
          </div>
          <List className="drawer-list">
            {items.map((i) => (
              <ListItem key={i.href} disablePadding>
                <ListItemButton component="a" href={`/${locale}${i.href}`} onClick={toggle(false)}>
                  <ListItemText primary={i.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <div className="drawer-lang">
            <a className={`lang-btn ${locale === 'uk' ? 'active' : ''}`} href={`/uk`} onClick={switchLocale('uk')}>Укр</a>
            <span className="lang-sep">/</span>
            <a className={`lang-btn ${locale === 'en' ? 'active' : ''}`} href={`/en`} onClick={switchLocale('en')}>Eng</a>
          </div>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}


