"use client"

import { useEffect, useState } from "react"
import { Building2, Sparkles, HardHat, Check } from "lucide-react"
import { cn } from "@/lib/utils"

type ThemeId = "conservative" | "saas" | "rugged"

const THEMES: {
  id: ThemeId
  label: string
  blurb: string
  icon: typeof Building2
}[] = [
  {
    id: "conservative",
    label: "Conservative",
    blurb: "Light, navy & serif — classic professional",
    icon: Building2,
  },
  {
    id: "saas",
    label: "Modern SaaS",
    blurb: "Dark, refined blue — premium product feel",
    icon: Sparkles,
  },
  {
    id: "rugged",
    label: "Field Rugged",
    blurb: "Charcoal & safety amber — built for the field",
    icon: HardHat,
  },
]

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<ThemeId>("saas")
  const [open, setOpen] = useState(false)

  // Reflect the current attribute on mount (in case it was preset).
  useEffect(() => {
    const current = document.documentElement.getAttribute(
      "data-theme",
    ) as ThemeId | null
    if (current) setTheme(current)
  }, [])

  function apply(id: ThemeId) {
    document.documentElement.setAttribute("data-theme", id)
    setTheme(id)
    setOpen(false)
  }

  const active = THEMES.find((t) => t.id === theme) ?? THEMES[1]
  const ActiveIcon = active.icon

  return (
    <div className="relative">
      {/* Compact trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <ActiveIcon className="size-4 text-primary" />
        <span className="hidden md:inline">{active.label}</span>
        <span className="rugged-label hidden text-[10px] font-semibold uppercase tracking-wider text-muted-foreground lg:inline">
          Theme
        </span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            role="menu"
            className="absolute right-0 top-11 z-50 w-72 overflow-hidden rounded-xl border border-border bg-popover p-1.5 shadow-2xl"
          >
            <p className="px-2.5 pb-1.5 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Visual direction
            </p>
            {THEMES.map((t) => {
              const Icon = t.icon
              const selected = t.id === theme
              return (
                <button
                  key={t.id}
                  role="menuitemradio"
                  aria-checked={selected}
                  onClick={() => apply(t.id)}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-lg px-2.5 py-2.5 text-left transition-colors",
                    selected ? "bg-accent" : "hover:bg-accent/60",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md",
                      selected
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground",
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-foreground">
                        {t.label}
                      </span>
                      {selected && (
                        <Check className="size-3.5 text-primary" />
                      )}
                    </span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                      {t.blurb}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
