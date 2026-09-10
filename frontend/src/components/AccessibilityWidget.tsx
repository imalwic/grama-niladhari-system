"use client";

import { useState, useEffect, useRef } from "react";
import { Settings, Type, Moon, Globe } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";

export function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const t = useTranslations("Settings");

  useEffect(() => {
    const storedDark = localStorage.getItem("dark-mode") === "true";
    const storedText = localStorage.getItem("large-text") === "true";
    
    setDarkMode(storedDark);
    setLargeText(storedText);
    
    if (storedDark) document.documentElement.classList.add("dark");
    if (storedText) document.documentElement.classList.add("large-text");
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDarkMode = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    localStorage.setItem("dark-mode", String(newValue));
    document.documentElement.classList.toggle("dark", newValue);
  };

  const toggleLargeText = () => {
    const newValue = !largeText;
    setLargeText(newValue);
    localStorage.setItem("large-text", String(newValue));
    document.documentElement.classList.toggle("large-text", newValue);
  };

  const changeLanguage = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50" ref={dropdownRef}>
      <button 
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center h-12 w-12 rounded-full shadow-lg border-2 border-[#003366] bg-white text-[#003366] dark:border-blue-500 dark:bg-slate-800 dark:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#003366] dark:focus:ring-blue-500 transition-transform hover:scale-105"
        aria-label={t("title")}
      >
        <Settings className="h-6 w-6" />
      </button>

      {open && (
        <div className="absolute bottom-16 right-0 w-64 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-800 dark:text-slate-200">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
            <h3 className="font-semibold text-sm">{t("title")}</h3>
          </div>
          
          <div className="p-2 space-y-1">
            {/* Accessibility Section */}
            <div className="px-2 py-1 text-xs font-semibold text-slate-500 uppercase">{t("accessibility")}</div>
            <button 
              onClick={toggleDarkMode}
              className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
            >
              <span className="flex items-center">
                <Moon className="mr-2 h-4 w-4 text-slate-500" />
                {t("darkMode")}
              </span>
              {darkMode && <span className="text-green-600 font-bold text-xs">ON</span>}
            </button>
            <button 
              onClick={toggleLargeText}
              className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
            >
              <span className="flex items-center">
                <Type className="mr-2 h-4 w-4 text-slate-500" />
                {t("largeText")}
              </span>
              {largeText && <span className="text-green-600 font-bold text-xs">ON</span>}
            </button>

            <div className="my-1 border-t border-slate-100 dark:border-slate-800"></div>

            {/* Language Section */}
            <div className="px-2 py-1 text-xs font-semibold text-slate-500 uppercase mt-2">{t("language")}</div>
            <div className="grid grid-cols-3 gap-1 px-1">
              <button
                onClick={() => changeLanguage('en')}
                className={`py-1.5 text-xs text-center rounded-md transition-colors ${currentLocale === 'en' ? 'bg-[#003366] text-white dark:bg-blue-600' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                English
              </button>
              <button
                onClick={() => changeLanguage('si')}
                className={`py-1.5 text-xs text-center rounded-md transition-colors ${currentLocale === 'si' ? 'bg-[#003366] text-white dark:bg-blue-600' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                සිංහල
              </button>
              <button
                onClick={() => changeLanguage('ta')}
                className={`py-1.5 text-xs text-center rounded-md transition-colors ${currentLocale === 'ta' ? 'bg-[#003366] text-white dark:bg-blue-600' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                தமிழ்
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

