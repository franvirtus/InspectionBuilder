"use client"

import { useState } from "react"
import Image from "next/image"
import {
  AlertOctagon,
  Camera,
  ClipboardList,
  LayoutGrid,
  MapPin,
  Plus,
  Search,
  Settings2,
  Trash2,
} from "lucide-react"
import {
  SEVERITY,
  SEVERITY_ORDER,
  severityCounts,
  type Finding,
  type ReportDetails,
} from "@/lib/inspection"
import { SeverityBadge } from "./severity-badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent,
}: {
  label: string
  value: string | number
  hint: string
  icon: typeof Camera
  accent?: string
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <span
          className={cn(
            "flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground",
            accent,
          )}
        >
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  )
}

function EmptyState({
  onAddFinding,
  onSetup,
  hasDetails,
}: {
  onAddFinding: () => void
  onSetup: () => void
  hasDetails: boolean
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
        <ClipboardList className="size-8 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">No findings yet</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
        {hasDetails
          ? "Browse the defect library and add your first finding to get started."
          : "Start by filling in the report details (client, address, inspector), then add your first finding."}
      </p>
      <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row">
        {!hasDetails && (
          <Button variant="outline" onClick={onSetup} className="gap-2">
            <Settings2 className="size-4" />
            Set up report details
          </Button>
        )}
        <Button onClick={onAddFinding} className="gap-2">
          <Plus className="size-4" />
          Add first finding
        </Button>
      </div>
    </div>
  )
}

export function DashboardView({
  findings,
  reportDetails,
  onAddFinding,
  onSelectFinding,
  onRemoveFinding,
  onSetup,
}: {
  findings: Finding[]
  reportDetails: ReportDetails
  onAddFinding: () => void
  onSelectFinding: (f: Finding) => void
  onRemoveFinding: (id: string) => void
  onSetup: () => void
}) {
  const [search, setSearch] = useState("")

  const counts = severityCounts(findings)
  const photos = findings.filter((f) => f.photo).length
  const systemsCovered = new Set(findings.map((f) => f.category)).size
  const hasDetails = !!(reportDetails.address || reportDetails.client)

  const filtered = search.trim()
    ? findings.filter(
        (f) =>
          f.title.toLowerCase().includes(search.toLowerCase()) ||
          f.category.toLowerCase().includes(search.toLowerCase()) ||
          f.location.toLowerCase().includes(search.toLowerCase()),
      )
    : findings

  const addressLine = reportDetails.address || "Untitled Inspection"
  const cityStateLine = reportDetails.cityState

  return (
    <div className="mx-auto max-w-5xl px-5 py-6 md:px-8">
      {/* Page header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Inspection Report</p>
          <h1 className="mt-1 text-balance text-2xl font-semibold tracking-tight md:text-3xl">
            {addressLine}
          </h1>
          {cityStateLine && (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-4" />
              {cityStateLine}
            </p>
          )}
        </div>
        <Button onClick={onAddFinding} size="lg" className="gap-2">
          <Plus className="size-4" />
          Add Finding
        </Button>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Total Findings"
          value={findings.length}
          hint="Across all systems"
          icon={LayoutGrid}
        />
        <StatCard
          label="Major Defects"
          value={counts.major}
          hint="Need immediate attention"
          icon={AlertOctagon}
          accent="bg-major/15 text-major"
        />
        <StatCard
          label="Photos Captured"
          value={photos}
          hint="Documented evidence"
          icon={Camera}
        />
        <StatCard
          label="Systems Covered"
          value={systemsCovered}
          hint="Unique categories"
          icon={Search}
        />
      </div>

      {/* Severity distribution bar — only when there are findings */}
      {findings.length > 0 && (
        <div className="mt-6 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Severity Distribution</p>
            <p className="text-xs text-muted-foreground">{findings.length} findings</p>
          </div>
          <div className="mt-3 flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
            {SEVERITY_ORDER.map((s) =>
              counts[s] > 0 ? (
                <div
                  key={s}
                  className={cn("h-full", SEVERITY[s].dot)}
                  style={{ width: `${(counts[s] / findings.length) * 100}%` }}
                />
              ) : null,
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
            {SEVERITY_ORDER.map((s) => (
              <span
                key={s}
                className="flex items-center gap-1.5 text-xs text-muted-foreground"
              >
                <span className={cn("size-2 rounded-full", SEVERITY[s].dot)} />
                {SEVERITY[s].short}
                <span className="font-semibold text-foreground">{counts[s]}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Findings list */}
      <div className="mt-8">
        {findings.length > 0 && (
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Findings</h2>
            <div className="relative hidden sm:block">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search findings"
                className="h-9 w-56 rounded-lg border border-border bg-card pl-8 pr-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
        )}

        {findings.length === 0 ? (
          <EmptyState
            onAddFinding={onAddFinding}
            onSetup={onSetup}
            hasDetails={hasDetails}
          />
        ) : (
          <div className="mt-4 space-y-3">
            {filtered.length === 0 && search.trim() ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Search className="size-6 text-muted-foreground" />
                <p className="mt-2 text-sm font-medium">No results for &ldquo;{search}&rdquo;</p>
                <p className="text-sm text-muted-foreground">Try a different keyword.</p>
              </div>
            ) : (
              filtered.map((f) => (
                <article
                  key={f.id}
                  className="group flex cursor-pointer gap-4 rounded-xl border border-border bg-card p-3 transition-colors hover:border-primary/40 hover:bg-accent/40"
                  onClick={() => onSelectFinding(f)}
                >
                  <div className="relative size-24 shrink-0 overflow-hidden rounded-lg bg-muted sm:size-28">
                    {f.photo ? (
                      <Image
                        src={f.photo}
                        alt={f.title}
                        fill
                        className="object-cover"
                        sizes="112px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        <Camera className="size-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <SeverityBadge severity={f.severity} />
                          <span className="text-xs font-medium text-muted-foreground">
                            {f.category}
                          </span>
                        </div>
                        <h3 className="mt-1.5 truncate text-base font-semibold">
                          {f.title}
                        </h3>
                        <p className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="size-3" />
                          {f.location}
                        </p>
                      </div>
                      <button
                        aria-label="Remove finding"
                        onClick={(e) => {
                          e.stopPropagation()
                          onRemoveFinding(f.id)
                        }}
                        className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-0 transition hover:bg-destructive/15 hover:text-destructive group-hover:opacity-100"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {f.observation}
                    </p>
                  </div>
                </article>
              ))
            )}

            {filtered.length > 0 && (
              <button
                onClick={onAddFinding}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card/40 py-5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
              >
                <Plus className="size-4" />
                Add another finding from the defect library
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
