import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-line bg-paper">
      <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
        <NavLink to="/" className="text-lg font-medium">
          ROTASY
        </NavLink>

        <nav className="flex gap-6 text-sm uppercase tracking-widest">
          <NavLink to="/" className="hover:opacity-60">
            Home
          </NavLink>
          <NavLink to="/works" className="hover:opacity-60">
            Works
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
