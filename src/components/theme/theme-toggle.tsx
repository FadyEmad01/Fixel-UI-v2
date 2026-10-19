"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { motion } from "motion/react";
import { Sun, Moon, Laptop } from "lucide-react";
import { cn } from "@/lib/utils";

const themes = [
  { key: "light", icon: Sun, label: "Light theme" },
  { key: "dark", icon: Moon, label: "Dark theme" },
  { key: "system", icon: Laptop, label: "System theme" },
] as const;

type ThemeKey = (typeof themes)[number]["key"];

interface ThemeSwitcherProps {
  className?: string;
}

export function ThemeSwitcher({ className }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  // Default to 'system' so a valid theme index is always selected on initial mount
  const [activeTheme, setActiveTheme] = React.useState<string>("system");

  React.useEffect(() => {
    setMounted(true);
    if (theme) {
      setActiveTheme(theme);
    }
  }, [theme]);

  const handleSelect = (key: ThemeKey) => {
    setActiveTheme(key); // Optimistic instant UI update
    setTheme(key);       // Update next-themes context
  };

  // Find target button index for transform translation
  const activeIndex = themes.findIndex((t) => t.key === activeTheme);
  const selectedIndex = activeIndex !== -1 ? activeIndex : 2;

  // Hydration fallback
  if (!mounted) {
    return (
      <div
        className={cn(
          "relative flex h-8 w-[128px] items-center rounded-full bg-input/90 p-1 ring-1 ring-border",
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "relative isolate flex h-8 rounded-full bg-input/90 p-1 ring-1 ring-border",
        className
      )}
    >
      {/* Single persistent sliding background pill */}
      <motion.div
        className="absolute bottom-1 left-1 top-1 z-0 w-10 rounded-full bg-secondary shadow-sm"
        initial={false}
        animate={{
          x: selectedIndex * 40, // 40px is the exact width of each button (w-10)
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
        }}
      />

      {themes.map(({ key, icon: Icon, label }) => {
        const isActive = activeTheme === key;

        return (
          <button
            key={key}
            type="button"
            aria-label={label}
            className="relative z-10 h-6 w-10 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => handleSelect(key)}
          >
            <Icon
              className={cn(
                "m-auto h-4 w-4 transition-colors duration-200",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}