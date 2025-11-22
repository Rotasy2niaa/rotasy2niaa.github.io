// src/components/Navbar.jsx
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-20 border-b border-line bg-paper/90 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <NavLink to="/" className="flex flex-col leading-none">
          <span className="font-display text-2xl tracking-[0.08em] text-blush">
            ROTASY
          </span>
          <span className="text-[11px] uppercase tracking-[0.2em] text-ink/60">
            personal archive
          </span>
        </NavLink>

        <nav className="flex gap-6 text-xs uppercase tracking-[0.18em]">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `pb-0.5 border-b ${
                isActive ? "border-ink text-ink" : "border-transparent text-ink/70"
              } hover:border-ink hover:text-ink`
            }
          >
            home
          </NavLink>
          <NavLink
            to="/works"
            className={({ isActive }) =>
              `pb-0.5 border-b ${
                isActive ? "border-ink text-ink" : "border-transparent text-ink/70"
              } hover:border-ink hover:text-ink`
            }
          >
            works
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
