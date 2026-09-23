import { Link, NavLink, Outlet } from "react-router-dom";
import { ArrowUpRight, Dumbbell, Instagram, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/Button";
import { PWAInstallPrompt, PWAHeaderButton } from "./PWAInstallPrompt";

export function Layout() {
  const [open, setOpen] = useState(false);
  const links = [
    ["Membership", "/membership"],
    ["Classes", "/classes"],
    ["Coaches", "/trainers"],
    ["Contact", "/contact"]
  ];

  return (
    <div className="site-shell">
      <PWAInstallPrompt />
      <header className="navbar">
        <Link className="brand" to="/">
          <span className="brand-mark">
            <Dumbbell size={20} />
          </span>
          <span>
            IRONHOUSE<span className="brand-accent">.</span>
          </span>
        </Link>
        <button
          className="menu-toggle"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav className={open ? "nav-links open" : "nav-links"}>
          {links.map(([label, path]) => (
            <NavLink key={path} to={path} onClick={() => setOpen(false)}>
              {label}
            </NavLink>
          ))}
          <PWAHeaderButton />
          <Link to="/contact" onClick={() => setOpen(false)}>
            <Button>
              Start training <ArrowUpRight size={16} />
            </Button>
          </Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="footer">
        <div>
          <Link className="brand" to="/">
            <span className="brand-mark">
              <Dumbbell size={18} />
            </span>
            <span>
              IRONHOUSE<span className="brand-accent">.</span>
            </span>
          </Link>
          <p>
            Serious training. Human energy.
            <br />
            Built for the long run.
          </p>
        </div>
        <div className="footer-meta">
          <a href="mailto:hello@ironhouse.fit">hello@ironhouse.fit</a>
          <span>London · Open 24/7</span>
          <a href="https://instagram.com" aria-label="Instagram">
            <Instagram size={18} />
          </a>
        </div>
      </footer>
    </div>
  );
}
