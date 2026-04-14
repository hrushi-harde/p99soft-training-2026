import { useEffect, useState } from "react";

export default function Navbar() {
  const getInitialTheme = () => {
    try {
      const stored = localStorage.getItem("theme");
      if (stored === "dark" || stored === "light") return stored;
    } catch {
      // ignore
    }

    const systemPrefersDark =
      window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    return systemPrefersDark ? "dark" : "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);

  const applyTheme = (nextTheme) => {
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    document.documentElement.dataset.theme = nextTheme;

    try {
      localStorage.setItem("theme", nextTheme);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <header className="border-b border-slate-200/70 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-slate-800/60 dark:bg-slate-950/60">
      <div className="relative mx-auto flex max-w-5xl items-center justify-center px-4 py-5 sm:px-6">
        <h1 className="text-center text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
          😊 Mood Tracker
        </h1>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          className="absolute right-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/70 text-slate-700 shadow-sm transition hover:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-100 dark:hover:bg-slate-900 dark:focus:ring-indigo-900/40 sm:right-6"
        >
          <span className="text-lg leading-none">{theme === "dark" ? "🌙" : "☀️"}</span>
        </button>
      </div>
    </header>
  );
}