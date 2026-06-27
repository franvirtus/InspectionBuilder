"use client"

import Image from "next/image"
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Edit2,
  MapPin,
  ShieldCheck,
  User,
  UserCircle2,
} from "lucide-react"
import {
  SEVERITY,
  SEVERITY_ORDER,
  severityCounts,
  type Finding,
  type ReportDetails,
} from "@/lib/inspection"
import { cn } from "@/lib/utils"

function DetailRow({
  icon: Icon,
  label,
  value,
  sub,
  empty,
}: {
  icon: typeof User
  label: string
  value: string
  sub?: string
  empty?: boolean
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-sidebar-accent">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-sidebar-accent text-muted-foreground">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className={cn("truncate text-sm font-medium", empty ? "italic text-muted-foreground" : "text-sidebar-foreground")}>
          {value || "—"}
        </p>
        {sub && <p className="truncate text-xs text-muted-foreground">{sub}</p>}
      </div>
    </div>
  )
}

export function ReportSidebar({
  findings,
  reportDetails,
  onEditDetails,
  onEditFinding,
}: {
  findings: Finding[]
  reportDetails: ReportDetails
  onEditDetails: () => void
  onEditFinding: (f: Finding) => void
}) {
  const d = reportDetails
  const counts = severityCounts(findings)
  const total = findings.length
  const completedSections = new Set(findings.map((f) => f.category)).size
  const completion = Math.min(100, Math.round((completedSections / 9) * 100))

  return (
    <aside className="flex h-full w-full flex-col bg-sidebar text-sidebar-foreground">
      {/* Brand */}
      <div className="flex items-center gap-2.5 border-b border-sidebar-border px-5 py-4">
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <ClipboardCheck className="size-5" />
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold tracking-tight">InspectionBuilder</p>
          <p className="text-xs text-muted-foreground">Report Studio</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        {/* Cover photo */}
        <div className="px-2">
          <div className="group relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-sidebar-border">
            <Image
              src={d.coverPhoto || "/inspection/cover-home.png"}
              alt="Cover photo of the inspected property"
              fill
              className="object-cover"
              sizes="320px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-2 left-3 right-3">
              <p className="truncate text-sm font-semibold text-white">
                {d.address || "Property address not set"}
              </p>
              {d.cityState && <p className="text-xs text-white/80">{d.cityState}</p>}
            </div>
          </div>
        </div>

        {/* Report details */}
        <div className="mt-5">
          <div className="flex items-center justify-between px-2 pb-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Report Details
            </p>
            <button
              onClick={onEditDetails}
              className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
            >
              <Edit2 className="size-3" />
              Edit
            </button>
          </div>
          <div className="space-y-0.5">
            <DetailRow icon={User} label="Client" value={d.client} empty={!d.client} />
            <DetailRow
              icon={MapPin}
              label="Property Address"
              value={d.address}
              sub={d.cityState}
              empty={!d.address}
            />
            <DetailRow icon={CalendarDays} label="Inspection Date" value={d.date} />
            <DetailRow
              icon={UserCircle2}
              label="Inspector"
              value={d.inspector}
              sub={d.license || undefined}
              empty={!d.inspector}
            />
            <DetailRow icon={Building2} label="Company" value={d.company} empty={!d.company} />
          </div>
        </div>

        {/* Findings summary */}
        <div className="mt-5">
          <div className="flex items-center justify-between px-2 pb-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Findings
            </p>
            <span className="rounded-full bg-sidebar-accent px-2 py-0.5 text-xs font-semibold">
              {total}
            </span>
          </div>
          <div className="space-y-1.5 px-1">
            {SEVERITY_ORDER.map((s) => {
              const meta = SEVERITY[s]
              return (
                <div
                  key={s}
                  className="flex items-center justify-between rounded-lg px-2 py-1.5"
                >
                  <span className="flex items-center gap-2 text-sm text-sidebar-foreground">
                    <span className={cn("size-2.5 rounded-full", meta.dot)} />
                    {meta.short}
                  </span>
                  <span className="text-sm font-semibold tabular-nums text-muted-foreground">
                    {counts[s]}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Footer status */}
      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center justify-between rounded-lg bg-sidebar-accent px-3 py-2.5">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-primary" />
            <div className="leading-tight">
              <p className="text-xs font-medium">Report {completion}% complete</p>
              <p className="text-[11px] text-muted-foreground">{completedSections} of 9 sections</p>
            </div>
          </div>
          <button onClick={onEditDetails}>
            <ChevronRight className="size-4 text-muted-foreground" />
          </button>
        </div>
        <div className="mt-2 flex items-center gap-1.5 px-1 text-[11px] text-muted-foreground">
          <ShieldCheck className="size-3.5" />
          TREC-compliant template
        </div>
      </div>
    </aside>
  )
}
