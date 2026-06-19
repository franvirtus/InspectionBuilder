import { SEVERITY, type Severity } from "@/lib/inspection"
import { cn } from "@/lib/utils"

export function SeverityBadge({
  severity,
  className,
  withIcon = true,
}: {
  severity: Severity
  className?: string
  withIcon?: boolean
}) {
  const meta = SEVERITY[severity]
  const Icon = meta.icon
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        meta.tint,
        className,
      )}
    >
      {withIcon && <Icon className="size-3.5" aria-hidden="true" />}
      {meta.short}
    </span>
  )
}

export function SeverityDot({ severity }: { severity: Severity }) {
  return (
    <span
      className={cn("inline-block size-2 rounded-full", SEVERITY[severity].dot)}
      aria-hidden="true"
    />
  )
}
