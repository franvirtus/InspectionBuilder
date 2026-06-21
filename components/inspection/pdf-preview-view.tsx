"use client"

import Image from "next/image"
import { AlertTriangle, ClipboardCheck, Printer } from "lucide-react"
import {
  SEVERITY_ORDER,
  severityCounts,
  type Finding,
  type ReportDetails,
  type Severity,
} from "@/lib/inspection"
import { Button } from "@/components/ui/button"

const PRINT_SEVERITY: Record<Severity, { bg: string; text: string; label: string }> = {
  major: { bg: "#fdecec", text: "#c0392b", label: "Major" },
  moderate: { bg: "#fdf0e3", text: "#b9651a", label: "Moderate" },
  minor: { bg: "#fbf6e0", text: "#9a7a12", label: "Minor" },
  info: { bg: "#e9f0fb", text: "#2b5fa6", label: "Informational" },
}

function Sheet({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[760px] rounded-sm bg-white text-[#1f2733] shadow-[0_8px_40px_rgba(0,0,0,0.45)] ring-1 ring-black/5 print:shadow-none print:ring-0">
      {children}
    </div>
  )
}

export function PdfPreviewView({
  findings,
  reportDetails,
}: {
  findings: Finding[]
  reportDetails: ReportDetails
}) {
  const d = reportDetails
  const counts = severityCounts(findings)

  const displayAddress = d.address || "Property Address"
  const displayCityState = d.cityState || ""
  const displayClient = d.client || "Client Name"
  const displayDate = d.date || "Inspection Date"
  const displayInspector = d.inspector || "Inspector Name"
  const displayLicense = d.license || ""
  const displayCompany = d.company || "Company Name"

  return (
    <div className="px-4 py-6 md:px-8">
      {/* Action bar */}
      <div className="mx-auto mb-6 flex max-w-[760px] items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">PDF Preview</h1>
          <p className="text-sm text-muted-foreground">
            Visual approximation of the generated report. Use Print to save as PDF.
          </p>
        </div>
        <Button
          className="gap-2"
          onClick={() => window.print()}
        >
          <Printer className="size-4" />
          Print / Save PDF
        </Button>
      </div>

      {/* Completeness warning */}
      {(!d.inspector || !d.address || findings.length === 0) && (
        <div className="mx-auto mb-4 max-w-[760px] flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-500" />
          <div className="text-sm">
            <p className="font-medium text-foreground">Report is incomplete</p>
            <ul className="mt-1 space-y-0.5 text-muted-foreground">
              {!d.inspector && <li>· Inspector name is missing (Report Setup)</li>}
              {!d.address && <li>· Property address is missing (Report Setup)</li>}
              {findings.length === 0 && <li>· No findings have been added yet</li>}
            </ul>
          </div>
        </div>
      )}

      {/* Print area — only this is shown when printing */}
      <div id="pdf-print-area" className="space-y-6">
        {/* Cover page */}
        <Sheet>
          <div className="relative aspect-[3/2] w-full overflow-hidden rounded-t-sm">
            <Image
              src={d.coverPhoto || "/inspection/cover-home.png"}
              alt="Property cover"
              fill
              className="object-cover"
              sizes="760px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute left-8 top-7 flex items-center gap-2 text-white">
              <span className="flex size-8 items-center justify-center rounded-md bg-white/15 backdrop-blur-sm">
                <ClipboardCheck className="size-4.5" />
              </span>
              <span className="text-sm font-semibold tracking-tight">
                {displayCompany}
              </span>
            </div>
            <div className="absolute bottom-7 left-8 right-8 text-white">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/80">
                Home Inspection Report
              </p>
              <h2 className="mt-1.5 text-2xl font-bold leading-tight">
                {displayAddress}
              </h2>
              {displayCityState && (
                <p className="text-sm text-white/85">{displayCityState}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 px-8 py-7 sm:grid-cols-4">
            {[
              ["Prepared For", displayClient],
              ["Inspection Date", displayDate],
              ["Inspector", displayInspector],
              ["License", displayLicense || "—"],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8a93a1]">
                  {label}
                </p>
                <p className="mt-0.5 text-sm font-medium text-[#1f2733]">{value}</p>
              </div>
            ))}
          </div>
        </Sheet>

        {/* Summary page */}
        <Sheet>
          <div className="px-8 py-8">
            <div className="flex items-center justify-between border-b border-[#e7eaef] pb-3">
              <h3 className="text-base font-bold">Summary of Findings</h3>
              <span className="text-xs text-[#8a93a1]">Page 2</span>
            </div>

            <div className="mt-5 grid grid-cols-4 gap-3">
              {SEVERITY_ORDER.map((s) => {
                const p = PRINT_SEVERITY[s]
                return (
                  <div
                    key={s}
                    className="rounded-lg border border-[#edf0f4] p-3 text-center"
                  >
                    <p className="text-2xl font-bold tabular-nums" style={{ color: p.text }}>
                      {counts[s]}
                    </p>
                    <p className="mt-0.5 text-[11px] font-medium text-[#5b636f]">
                      {p.label}
                    </p>
                  </div>
                )
              })}
            </div>

            {findings.length === 0 ? (
              <p className="mt-6 text-sm text-[#8a93a1]">
                No findings have been added yet.
              </p>
            ) : (
              <ul className="mt-6 divide-y divide-[#eef1f5]">
                {findings.map((f) => {
                  const p = PRINT_SEVERITY[f.severity]
                  return (
                    <li key={f.id} className="flex items-center gap-3 py-2.5">
                      <span
                        className="inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                        style={{ backgroundColor: p.bg, color: p.text }}
                      >
                        {p.label}
                      </span>
                      <span className="flex-1 text-sm font-medium text-[#2b333f]">
                        {f.title}
                      </span>
                      <span className="text-xs text-[#8a93a1]">{f.category}</span>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </Sheet>

        {/* Detail pages */}
        {findings.map((f, i) => {
          const p = PRINT_SEVERITY[f.severity]
          return (
            <Sheet key={f.id}>
              <div className="px-8 py-8">
                <div className="flex items-center justify-between border-b border-[#e7eaef] pb-3">
                  <h3 className="text-base font-bold">Detailed Finding</h3>
                  <span className="text-xs text-[#8a93a1]">Page {i + 3}</span>
                </div>

                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <span
                      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide"
                      style={{ backgroundColor: p.bg, color: p.text }}
                    >
                      {p.label} Defect
                    </span>
                    <h4 className="mt-2 text-lg font-bold text-[#1f2733]">{f.title}</h4>
                    <p className="text-sm text-[#5b636f]">
                      {f.category} · {f.location}
                    </p>
                  </div>
                </div>

                {f.photo && (
                  <div className="relative mt-4 aspect-[16/9] w-full overflow-hidden rounded-lg ring-1 ring-[#e7eaef]">
                    <Image
                      src={f.photo}
                      alt={f.title}
                      fill
                      className="object-cover"
                      sizes="700px"
                    />
                  </div>
                )}

                <div className="mt-5 space-y-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#8a93a1]">
                      Observation
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-[#2b333f]">
                      {f.observation}
                    </p>
                  </div>
                  <div className="rounded-lg p-4" style={{ backgroundColor: p.bg }}>
                    <p
                      className="text-[11px] font-bold uppercase tracking-wider"
                      style={{ color: p.text }}
                    >
                      Recommendation
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-[#2b333f]">
                      {f.recommendation}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-[#e7eaef] pt-3 text-[11px] text-[#8a93a1]">
                  <span>{displayCompany}</span>
                  <span>{displayAddress}</span>
                </div>
              </div>
            </Sheet>
          )
        })}
      </div>
    </div>
  )
}
