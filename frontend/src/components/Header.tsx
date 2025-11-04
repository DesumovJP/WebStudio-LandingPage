"use client";

import Link from "next/link";
import { AppBar, Toolbar, Button, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { useDict } from "@/i18n/DictContext";

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
            <Link className={`lang-btn ${locale === 'uk' ? 'active' : ''}`} href={`/uk`}>Укр</Link>
            <span className="lang-sep">/</span>
            <Link className={`lang-btn ${locale === 'en' ? 'active' : ''}`} href={`/en`}>Eng</Link>
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
            <Link className={`lang-btn ${locale === 'uk' ? 'active' : ''}`} href={`/uk`} onClick={toggle(false)}>Укр</Link>
            <span className="lang-sep">/</span>
            <Link className={`lang-btn ${locale === 'en' ? 'active' : ''}`} href={`/en`} onClick={toggle(false)}>Eng</Link>
          </div>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}


