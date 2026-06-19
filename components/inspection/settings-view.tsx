"use client"

import { useState } from "react"
import { Building2, CalendarDays, ClipboardCheck, MapPin, Save, User, UserCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ReportDetails } from "@/lib/inspection"

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string
  icon: typeof User
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
        <Icon className="size-3.5 text-muted-foreground" />
        {label}
      </label>
      {children}
    </div>
  )
}

const inputClass =
  "h-10 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"

export function SettingsView({
  details,
  onSave,
}: {
  details: ReportDetails
  onSave: (d: ReportDetails) => void
}) {
  const [draft, setDraft] = useState<ReportDetails>(details)
  const [saved, setSaved] = useState(false)

  function update<K extends keyof ReportDetails>(key: K, value: ReportDetails[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  function handleSave() {
    onSave(draft)
    setSaved(true)
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-6 md:px-8">
      <div className="flex items-center gap-2 text-sm font-medium text-primary">
        <ClipboardCheck className="size-4" />
        Report Setup
      </div>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
        Report Details
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        These details appear on the cover page and throughout the generated PDF report.
      </p>

      <div className="mt-8 space-y-5">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Client & Property
          </p>
          <div className="space-y-4">
            <Field label="Client name" icon={User}>
              <input
                value={draft.client}
                onChange={(e) => update("client", e.target.value)}
                placeholder="e.g. Daniel & Maria Whitfield"
                className={inputClass}
              />
            </Field>
            <Field label="Property address" icon={MapPin}>
              <input
                value={draft.address}
                onChange={(e) => update("address", e.target.value)}
                placeholder="e.g. 4827 Magnolia Crest Drive"
                className={inputClass}
              />
            </Field>
            <Field label="City, State & ZIP" icon={MapPin}>
              <input
                value={draft.cityState}
                onChange={(e) => update("cityState", e.target.value)}
                placeholder="e.g. Austin, TX 78745"
                className={inputClass}
              />
            </Field>
            <Field label="Inspection date" icon={CalendarDays}>
              <input
                value={draft.date}
                onChange={(e) => update("date", e.target.value)}
                placeholder="e.g. June 18, 2026"
                className={inputClass}
              />
            </Field>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Inspector & Company
          </p>
          <div className="space-y-4">
            <Field label="Inspector name" icon={UserCircle2}>
              <input
                value={draft.inspector}
                onChange={(e) => update("inspector", e.target.value)}
                placeholder="e.g. James Okafor"
                className={inputClass}
              />
            </Field>
            <Field label="License / certification number" icon={ClipboardCheck}>
              <input
                value={draft.license}
                onChange={(e) => update("license", e.target.value)}
                placeholder="e.g. TREC #24891"
                className={inputClass}
              />
            </Field>
            <Field label="Company name" icon={Building2}>
              <input
                value={draft.company}
                onChange={(e) => update("company", e.target.value)}
                placeholder="e.g. Lone Star Home Inspections"
                className={inputClass}
              />
            </Field>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Button onClick={handleSave} className="gap-2">
          <Save className="size-4" />
          {saved ? "Saved!" : "Save details"}
        </Button>
        {saved && (
          <p className="text-sm text-muted-foreground">
            Details updated — visible in the PDF preview.
          </p>
        )}
      </div>
    </div>
  )
}
