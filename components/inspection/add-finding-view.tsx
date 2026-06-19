"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import {
  Check,
  ImagePlus,
  MapPin,
  Plus,
  Search,
  X,
} from "lucide-react"
import {
  DEFECT_CATEGORIES,
  DEFECT_LIBRARY,
  SEVERITY,
  SEVERITY_ORDER,
  type DefectTemplate,
  type Finding,
  type Severity,
} from "@/lib/inspection"
import { SeverityBadge } from "./severity-badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const PHOTO_BY_CATEGORY: Record<string, string> = {
  Roofing: "/inspection/defect-roof.png",
  Electrical: "/inspection/defect-electrical.png",
  Plumbing: "/inspection/defect-plumbing.png",
  HVAC: "/inspection/defect-hvac.png",
  Structure: "/inspection/defect-foundation.png",
}

interface Draft {
  title: string
  category: string
  severity: Severity
  location: string
  observation: string
  recommendation: string
  photo?: string
}

const EMPTY_DRAFT: Draft = {
  title: "",
  category: "Roofing",
  severity: "moderate",
  location: "",
  observation: "",
  recommendation: "",
}

export function AddFindingView({
  onSave,
  onCancel,
}: {
  onSave: (f: Finding) => void
  onCancel: () => void
}) {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<string>("All")
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT)
  const [activeId, setActiveId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return DEFECT_LIBRARY.filter((d) => {
      const matchCat = category === "All" || d.category === category
      const matchQuery =
        !query ||
        d.title.toLowerCase().includes(query.toLowerCase()) ||
        d.category.toLowerCase().includes(query.toLowerCase())
      return matchCat && matchQuery
    })
  }, [query, category])

  function applyTemplate(t: DefectTemplate) {
    setActiveId(t.id)
    setDraft({
      title: t.title,
      category: t.category,
      severity: t.defaultSeverity,
      location: "",
      observation: t.observation,
      recommendation: t.recommendation,
      photo: PHOTO_BY_CATEGORY[t.category],
    })
  }

  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => ({ ...d, [key]: value }))
  }

  const canSave = draft.title.trim().length > 0

  function handleSave() {
    if (!canSave) return
    onSave({
      id: `f${Date.now()}`,
      title: draft.title,
      category: draft.category,
      severity: draft.severity,
      location: draft.location || "Unspecified location",
      observation: draft.observation,
      recommendation: draft.recommendation,
      photo: draft.photo,
    })
  }

  return (
    <div className="flex h-full flex-col lg:flex-row">
      {/* Defect library */}
      <section className="flex min-w-0 flex-1 flex-col border-b border-border lg:border-b-0 lg:border-r">
        <div className="border-b border-border px-5 py-4 md:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Defect Library</h1>
              <p className="text-sm text-muted-foreground">
                Pick a template to pre-fill the finding, then refine it.
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel} className="gap-1.5">
              <X className="size-4" />
              Cancel
            </Button>
          </div>
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search defects by category, title, or keyword…"
              className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {DEFECT_CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  category === c
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 md:px-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {filtered.map((t) => {
              const meta = SEVERITY[t.defaultSeverity]
              const active = activeId === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => applyTemplate(t)}
                  className={cn(
                    "group relative flex flex-col rounded-xl border bg-card p-4 text-left transition-all",
                    active
                      ? "border-primary ring-1 ring-primary"
                      : "border-border hover:border-primary/40 hover:bg-accent/40",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <SeverityBadge severity={t.defaultSeverity} />
                    <span
                      className={cn(
                        "flex size-6 items-center justify-center rounded-full transition-colors",
                        active
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground group-hover:bg-primary/15 group-hover:text-primary",
                      )}
                    >
                      {active ? (
                        <Check className="size-3.5" />
                      ) : (
                        <Plus className="size-3.5" />
                      )}
                    </span>
                  </div>
                  <h3 className="mt-2.5 text-sm font-semibold leading-snug">
                    {t.title}
                  </h3>
                  <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                    {t.category}
                  </p>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {t.observation}
                  </p>
                  <span className={cn("mt-3 h-0.5 w-8 rounded-full", meta.dot)} />
                </button>
              )
            })}
          </div>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Search className="size-8 text-muted-foreground" />
              <p className="mt-3 text-sm font-medium">No defects found</p>
              <p className="text-sm text-muted-foreground">
                Try a different search or category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Finding editor */}
      <section className="flex w-full shrink-0 flex-col bg-card/40 lg:w-[400px]">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-lg font-semibold tracking-tight">Finding Editor</h2>
          <p className="text-sm text-muted-foreground">Current finding</p>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {/* Photo upload */}
          <label className="mb-1.5 block text-sm font-medium">Photo</label>
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-dashed border-border bg-card">
            {draft.photo ? (
              <>
                <Image
                  src={draft.photo || "/placeholder.svg"}
                  alt="Finding photo"
                  fill
                  className="object-cover"
                  sizes="400px"
                />
                <button
                  onClick={() => update("photo", undefined)}
                  className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-md bg-black/60 text-white backdrop-blur-sm transition hover:bg-black/80"
                  aria-label="Remove photo"
                >
                  <X className="size-4" />
                </button>
              </>
            ) : (
              <button
                onClick={() =>
                  update("photo", PHOTO_BY_CATEGORY[draft.category] ?? "/inspection/defect-roof.png")
                }
                className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
              >
                <span className="flex size-10 items-center justify-center rounded-full bg-muted">
                  <ImagePlus className="size-5" />
                </span>
                <span className="text-sm font-medium">Upload or capture photo</span>
                <span className="text-xs">Drag & drop or click to browse</span>
              </button>
            )}
          </div>

          {/* Title */}
          <div className="mt-4">
            <label className="mb-1.5 block text-sm font-medium">Title</label>
            <input
              value={draft.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="e.g. Curling & missing shingles"
              className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          {/* Location */}
          <div className="mt-4">
            <label className="mb-1.5 block text-sm font-medium">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={draft.location}
                onChange={(e) => update("location", e.target.value)}
                placeholder="e.g. Roof — South Slope"
                className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>

          {/* Severity selector */}
          <div className="mt-4">
            <label className="mb-1.5 block text-sm font-medium">Severity</label>
            <div className="grid grid-cols-2 gap-2">
              {SEVERITY_ORDER.map((s) => {
                const meta = SEVERITY[s]
                const Icon = meta.icon
                const selected = draft.severity === s
                return (
                  <button
                    key={s}
                    onClick={() => update("severity", s)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all",
                      selected
                        ? meta.tint + " ring-1 ring-current"
                        : "border-border bg-card text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon className="size-4" />
                    {meta.short}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Observation */}
          <div className="mt-4">
            <label className="mb-1.5 block text-sm font-medium">Observation</label>
            <textarea
              value={draft.observation}
              onChange={(e) => update("observation", e.target.value)}
              rows={4}
              placeholder="Describe what was observed during the inspection…"
              className="w-full resize-none rounded-lg border border-border bg-card px-3 py-2.5 text-sm leading-relaxed outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          {/* Recommendation */}
          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium">Recommendation</label>
              </div>
            <textarea
              value={draft.recommendation}
              onChange={(e) => update("recommendation", e.target.value)}
              rows={3}
              placeholder="Recommend the appropriate corrective action…"
              className="w-full resize-none rounded-lg border border-border bg-card px-3 py-2.5 text-sm leading-relaxed outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-border px-5 py-4">
          <Button variant="outline" className="flex-1" onClick={onCancel}>
            Cancel
          </Button>
          <Button className="flex-1 gap-1.5" disabled={!canSave} onClick={handleSave}>
            <Check className="size-4" />
            Save Finding
          </Button>
        </div>
      </section>
    </div>
  )
}
