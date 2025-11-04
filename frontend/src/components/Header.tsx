"use client";

import Link from "next/link";
import { AppBar, Toolbar, Button, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const [open, setOpen] = useState(false);
  const toggle = (v: boolean) => () => setOpen(v);
  const pathname = usePathname() || "/";
  const parts = pathname.split("/");
  const currentLocale = ["uk", "en"].includes(parts[1]) ? parts[1] : undefined;
  const items = [
    { href: "#work", label: "Work" },
    { href: "#services", label: "Services" },
    { href: "#process", label: "Process" },
    { href: "#contact", label: "Contact" },
  ];
  return (
    <AppBar position="sticky" color="transparent" elevation={0} className="header">
      <Toolbar className="container header-toolbar">
        <Link href={`/${currentLocale ?? ''}` || '/uk'} aria-label="Studio brand" className="brand heading-lg brand-wrap header-left">
          <img src="http://localhost:1337/uploads/pawukpng_89b3bd786e.png" alt="Webbie logo" className="brand-logo" />
          <span>Webbie</span>
        </Link>
        <nav className="nav nav-desktop">
          {items.slice(0,3).map((i) => (
            <Button key={i.href} href={i.href} color="inherit">{i.label}</Button>
          ))}
          <Button href="#contact" color="inherit" variant="outlined" className="glass">Contact</Button>
          <LanguageSwitcher />
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
                <ListItemButton component="a" href={i.href} onClick={toggle(false)}>
                  <ListItemText primary={i.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <div className="drawer-lang"><LanguageSwitcher /></div>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}


