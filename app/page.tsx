"use client"

import { useEffect, useState } from "react"
import {
  Download,
  FileText,
  LayoutDashboard,
  Menu,
  PlusCircle,
  ScrollText,
  Settings2,
  X,
} from "lucide-react"
import { DEFAULT_REPORT_DETAILS, type Finding, type ReportDetails } from "@/lib/inspection"
import { ReportSidebar } from "@/components/inspection/report-sidebar"
import { DashboardView } from "@/components/inspection/dashboard-view"
import { AddFindingView } from "@/components/inspection/add-finding-view"
import { SummaryView } from "@/components/inspection/summary-view"
import { PdfPreviewView } from "@/components/inspection/pdf-preview-view"
import { SettingsView } from "@/components/inspection/settings-view"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type View = "dashboard" | "add" | "summary" | "pdf" | "settings"

const NAV: { id: View; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "add", label: "Add Finding", icon: PlusCircle },
  { id: "summary", label: "Summary", icon: ScrollText },
  { id: "pdf", label: "PDF Preview", icon: FileText },
  { id: "settings", label: "Report Setup", icon: Settings2 },
]

const LS_FINDINGS = "ib_findings"
const LS_DETAILS = "ib_report_details"

function loadFindings(): Finding[] {
  try {
    const raw = localStorage.getItem(LS_FINDINGS)
    if (raw) return JSON.parse(raw) as Finding[]
  } catch {}
  return []
}

function loadDetails(): ReportDetails {
  try {
    const raw = localStorage.getItem(LS_DETAILS)
    if (raw) return { ...DEFAULT_REPORT_DETAILS, ...JSON.parse(raw) }
  } catch {}
  return DEFAULT_REPORT_DETAILS
}

export default function Page() {
  const [view, setView] = useState<View>("dashboard")
  const [findings, setFindings] = useState<Finding[]>([])
  const [reportDetails, setReportDetails] = useState<ReportDetails>(DEFAULT_REPORT_DETAILS)
  const [mobileNav, setMobileNav] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setFindings(loadFindings())
    setReportDetails(loadDetails())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(LS_FINDINGS, JSON.stringify(findings))
  }, [findings, hydrated])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(LS_DETAILS, JSON.stringify(reportDetails))
  }, [reportDetails, hydrated])

  function addFinding(f: Finding) {
    setFindings((prev) => [f, ...prev])
    setView("dashboard")
  }

  function removeFinding(id: string) {
    setFindings((prev) => prev.filter((f) => f.id !== id))
  }

  function handleGeneratePdf() {
    setView("pdf")
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* Sidebar — desktop */}
      <div className="hidden w-[300px] shrink-0 border-r border-sidebar-border lg:block">
        <ReportSidebar
          findings={findings}
          reportDetails={reportDetails}
          onEditDetails={() => setView("settings")}
        />
      </div>

      {/* Sidebar — mobile drawer */}
      {mobileNav && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileNav(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[300px] max-w-[85%] border-r border-sidebar-border">
            <button
              onClick={() => setMobileNav(false)}
              className="absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-md bg-sidebar-accent text-sidebar-foreground"
              aria-label="Close menu"
            >
              <X className="size-4" />
            </button>
            <ReportSidebar
              findings={findings}
              reportDetails={reportDetails}
              onEditDetails={() => { setView("settings"); setMobileNav(false) }}
            />
          </div>
        </div>
      )}

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/80 px-3 backdrop-blur md:px-5">
          <button
            onClick={() => setMobileNav(true)}
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>

          {/* View tabs */}
          <nav className="flex items-center gap-1 overflow-x-auto">
            {NAV.map((item) => {
              const Icon = item.icon
              const active = view === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={cn(
                    "flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                  )}
                >
                  <Icon className="size-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              )
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <Button className="gap-2" onClick={handleGeneratePdf}>
              <Download className="size-4" />
              <span className="hidden sm:inline">Generate PDF</span>
              <span className="sm:hidden">PDF</span>
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="min-h-0 flex-1 overflow-y-auto">
          {view === "dashboard" && (
            <DashboardView
              findings={findings}
              reportDetails={reportDetails}
              onAddFinding={() => setView("add")}
              onSelectFinding={() => setView("add")}
              onRemoveFinding={removeFinding}
              onSetup={() => setView("settings")}
            />
          )}
          {view === "add" && (
            <AddFindingView
              onSave={addFinding}
              onCancel={() => setView("dashboard")}
            />
          )}
          {view === "summary" && (
            <SummaryView findings={findings} reportDetails={reportDetails} />
          )}
          {view === "pdf" && (
            <PdfPreviewView findings={findings} reportDetails={reportDetails} />
          )}
          {view === "settings" && (
            <SettingsView
              details={reportDetails}
              onSave={(d) => { setReportDetails(d) }}
            />
          )}
        </main>
      </div>
    </div>
  )
}
