"use client"

import Image from "next/image"
import { FileText, MapPin } from "lucide-react"
import {
  SEVERITY,
  SEVERITY_ORDER,
  severityCounts,
  type Finding,
  type ReportDetails,
} from "@/lib/inspection"
import { SeverityBadge } from "./severity-badge"
import { cn } from "@/lib/utils"

export function SummaryView({
  findings,
  reportDetails,
}: {
  findings: Finding[]
  reportDetails: ReportDetails
}) {
  const counts = severityCounts(findings)
  const d = reportDetails
  const priority = SEVERITY_ORDER.flatMap((s) =>
    findings.filter((f) => f.severity === s),
  )

  const inspectorInitials = d.inspector
    ? d.inspector.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?"

  return (
    <div className="mx-auto max-w-4xl px-5 py-6 md:px-8">
      <div className="flex items-center gap-2 text-sm font-medium text-primary">
        <FileText className="size-4" />
        Executive Summary
      </div>
      <h1 className="mt-1 text-balance text-2xl font-semibold tracking-tight md:text-3xl">
        Summary of Inspection Findings
      </h1>
      <p className="mt-2 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground">
        {d.address
          ? <>This summary highlights the most significant items discovered during the inspection of <strong className="text-foreground">{d.address}</strong>. It should be read together with the detailed findings and photographs.</>
          : "This summary highlights the most significant items discovered during this inspection. It should be read together with the detailed findings and photographs."}
      </p>

      {/* Severity overview cards */}
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {SEVERITY_ORDER.map((s) => {
          const meta = SEVERITY[s]
          const Icon = meta.icon
          return (
            <div
              key={s}
              className={cn("rounded-xl border bg-card p-4", "border-border")}
            >
              <div className="flex items-center justify-between">
                <span className={cn("flex size-9 items-center justify-center rounded-lg", meta.tint)}>
                  <Icon className="size-4.5" />
                </span>
                <span className="text-3xl font-semibold tabular-nums">
                  {counts[s]}
                </span>
              </div>
              <p className="mt-2 text-sm font-medium">{meta.label}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                {meta.description}
              </p>
            </div>
          )
        })}
      </div>

      {/* Priority findings */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold tracking-tight">Priority Findings</h2>
        <p className="text-sm text-muted-foreground">
          Ordered by severity. Major and moderate items warrant prompt attention.
        </p>

        {priority.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-border bg-card/40 px-6 py-10 text-center text-sm text-muted-foreground">
            No findings added yet. Go to <strong>Add Finding</strong> to start building the report.
          </div>
        ) : (
          <ol className="mt-4 space-y-3">
            {priority.map((f, i) => (
              <li
                key={f.id}
                className="flex gap-4 rounded-xl border border-border bg-card p-4"
              >
                <div className="flex flex-col items-center">
                  <span className="flex size-7 items-center justify-center rounded-full bg-muted text-sm font-semibold tabular-nums">
                    {i + 1}
                  </span>
                  {i < priority.length - 1 && (
                    <span className="mt-1 w-px flex-1 bg-border" />
                  )}
                </div>
                {f.photo && (
                  <div className="relative hidden size-16 shrink-0 overflow-hidden rounded-lg sm:block">
                    <Image
                      src={f.photo}
                      alt={f.title}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <SeverityBadge severity={f.severity} />
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="size-3" />
                      {f.location}
                    </span>
                  </div>
                  <h3 className="mt-1.5 font-semibold">{f.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {f.recommendation}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* Inspector note */}
      <div className="mt-8 rounded-xl border border-border bg-card p-5">
        <p className="text-sm leading-relaxed text-muted-foreground">
          <span className="font-semibold text-foreground">Inspector&apos;s note —</span>{" "}
          Major and moderate findings should be reviewed by qualified professionals before
          the end of the inspection contingency period. Minor and informational items
          should be used for routine maintenance planning.
        </p>
        <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
            {inspectorInitials}
          </div>
          <div>
            <p className="text-sm font-medium">{d.inspector || "Inspector name not set"}</p>
            <p className="text-xs text-muted-foreground">
              {[d.company, d.license].filter(Boolean).join(" · ") || "Set inspector details in Report Setup"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
