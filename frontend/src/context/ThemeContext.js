"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "dark",
  toggleTheme: () => {},
  setTheme: (theme) => {},
  mounted: false,
});

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState("dark");
  const [mounted, setMounted] = useState(false);

  const applyThemeClasses = (targetTheme) => {
    const root = document.documentElement;
    const body = document.body;
    if (targetTheme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
      if (body) {
        body.classList.add("dark");
        body.classList.remove("light");
      }
      root.setAttribute("data-theme", "dark");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
      if (body) {
        body.classList.remove("dark");
        body.classList.add("light");
      }
      root.setAttribute("data-theme", "light");
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    let initialTheme = "dark";
    if (savedTheme === "light" || savedTheme === "dark") {
      initialTheme = savedTheme;
    } else if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
      initialTheme = "light";
    }

    setThemeState(initialTheme);
    applyThemeClasses(initialTheme);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setThemeState((prevTheme) => {
      const nextTheme = prevTheme === "dark" ? "light" : "dark";
      applyThemeClasses(nextTheme);
      localStorage.setItem("theme", nextTheme);
      return nextTheme;
    });
  };

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    applyThemeClasses(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
