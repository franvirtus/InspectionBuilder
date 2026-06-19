import {
  AlertOctagon,
  AlertTriangle,
  Info,
  CircleDot,
  type LucideIcon,
} from "lucide-react"

export type Severity = "major" | "moderate" | "minor" | "info"

export interface SeverityMeta {
  id: Severity
  label: string
  short: string
  description: string
  icon: LucideIcon
  text: string
  bg: string
  tint: string
  dot: string
}

export const SEVERITY: Record<Severity, SeverityMeta> = {
  major: {
    id: "major",
    label: "Major Defect",
    short: "Major",
    description: "Safety hazard or significant repair. Recommend immediate attention.",
    icon: AlertOctagon,
    text: "text-major",
    bg: "bg-major text-major-foreground",
    tint: "bg-major/10 text-major border-major/30",
    dot: "bg-major",
  },
  moderate: {
    id: "moderate",
    label: "Moderate Defect",
    short: "Moderate",
    description: "Repair or replacement recommended in the near term.",
    icon: AlertTriangle,
    text: "text-moderate",
    bg: "bg-moderate text-moderate-foreground",
    tint: "bg-moderate/10 text-moderate border-moderate/30",
    dot: "bg-moderate",
  },
  minor: {
    id: "minor",
    label: "Minor Defect",
    short: "Minor",
    description: "Maintenance item. Monitor and address as part of upkeep.",
    icon: CircleDot,
    text: "text-minor",
    bg: "bg-minor text-minor-foreground",
    tint: "bg-minor/10 text-minor border-minor/30",
    dot: "bg-minor",
  },
  info: {
    id: "info",
    label: "Informational",
    short: "Info",
    description: "General observation for the client's awareness.",
    icon: Info,
    text: "text-info",
    bg: "bg-info text-info-foreground",
    tint: "bg-info/10 text-info border-info/30",
    dot: "bg-info",
  },
}

export const SEVERITY_ORDER: Severity[] = ["major", "moderate", "minor", "info"]

export interface DefectTemplate {
  id: string
  title: string
  category: string
  defaultSeverity: Severity
  observation: string
  recommendation: string
}

export const DEFECT_CATEGORIES = [
  "All",
  "Roofing",
  "Electrical",
  "Plumbing",
  "HVAC",
  "Structure",
  "Exterior",
  "Interior",
] as const

export const DEFECT_LIBRARY: DefectTemplate[] = [
  // Roofing
  {
    id: "roof-shingles",
    title: "Curling & missing shingles",
    category: "Roofing",
    defaultSeverity: "major",
    observation:
      "Multiple asphalt shingles on the south-facing slope are curling, lifting, and missing granules. Several shingles are absent near the ridge.",
    recommendation:
      "Have a licensed roofing contractor evaluate and repair or replace the affected sections to prevent water intrusion.",
  },
  {
    id: "roof-flashing",
    title: "Improper chimney flashing",
    category: "Roofing",
    defaultSeverity: "major",
    observation:
      "Chimney step flashing is improperly lapped and sealed with roofing tar rather than properly installed metal flashing.",
    recommendation:
      "Have a roofing contractor install proper step and counter flashing to prevent water intrusion at the chimney base.",
  },
  {
    id: "roof-gutters",
    title: "Clogged or damaged gutters",
    category: "Roofing",
    defaultSeverity: "moderate",
    observation:
      "Gutters are clogged with debris, pulling away from the fascia at multiple points, and showing visible corrosion.",
    recommendation:
      "Clean, repair, and resecure gutters. Replace damaged sections and ensure proper slope toward downspouts.",
  },
  {
    id: "roof-valley",
    title: "Open valley — exposed underlayment",
    category: "Roofing",
    defaultSeverity: "major",
    observation:
      "Roof valley flashing is absent or deteriorated, leaving underlayment exposed to weather and increasing leak risk.",
    recommendation:
      "Install proper closed-cut or W-style metal valley flashing. Evaluate adjacent decking for moisture damage.",
  },
  {
    id: "roof-penetration",
    title: "Unsealed roof penetration",
    category: "Roofing",
    defaultSeverity: "moderate",
    observation:
      "One or more roof penetrations show cracked or missing rubber boots and no adequate sealant.",
    recommendation:
      "Replace deteriorated pipe boot flashings and seal all penetrations to prevent water entry.",
  },
  // Electrical
  {
    id: "elec-double-tap",
    title: "Double-tapped breakers",
    category: "Electrical",
    defaultSeverity: "moderate",
    observation:
      "Two circuit breakers in the main panel have two conductors landed on a single lug not rated for multiple wires.",
    recommendation:
      "A licensed electrician should correct the connections to manufacturer specifications.",
  },
  {
    id: "elec-gfci",
    title: "Missing GFCI protection",
    category: "Electrical",
    defaultSeverity: "moderate",
    observation:
      "Receptacles within 6 ft of the bathroom and kitchen sinks lack ground-fault circuit interrupter protection.",
    recommendation:
      "Install GFCI protection at all required wet-area locations per current NEC standards.",
  },
  {
    id: "elec-open-knockouts",
    title: "Open knockouts in panel",
    category: "Electrical",
    defaultSeverity: "moderate",
    observation:
      "Several open knockouts were observed in the electrical panel, exposing live conductors and creating a shock hazard.",
    recommendation:
      "Install appropriate filler plates to close all open knockouts in the electrical panel.",
  },
  {
    id: "elec-aluminum-wiring",
    title: "Aluminum branch circuit wiring",
    category: "Electrical",
    defaultSeverity: "major",
    observation:
      "Aluminum branch circuit wiring was identified at outlets and switches. This can pose a fire hazard if not properly maintained.",
    recommendation:
      "Have a licensed electrician evaluate all connections and retrofit with CO/ALR devices or pigtailing with copper.",
  },
  {
    id: "elec-missing-cover",
    title: "Missing electrical cover plate",
    category: "Electrical",
    defaultSeverity: "minor",
    observation:
      "One or more electrical outlet, switch, or junction box cover plates are missing, leaving wiring exposed.",
    recommendation:
      "Install appropriate cover plates on all open electrical boxes.",
  },
  {
    id: "elec-panel-age",
    title: "Electrical panel at end of service life",
    category: "Electrical",
    defaultSeverity: "moderate",
    observation:
      "The electrical panel appears to be 40+ years old and may no longer meet current code requirements or load demands.",
    recommendation:
      "Have a licensed electrician evaluate the panel capacity, condition, and code compliance. Budget for replacement.",
  },
  // Plumbing
  {
    id: "plumb-active-leak",
    title: "Active leak at supply connection",
    category: "Plumbing",
    defaultSeverity: "major",
    observation:
      "Active moisture and corrosion observed at the supply line connection beneath the kitchen sink.",
    recommendation:
      "Recommend a licensed plumber repair the connection and evaluate for cabinet and floor damage.",
  },
  {
    id: "plumb-water-heater-age",
    title: "Water heater at end of service life",
    category: "Plumbing",
    defaultSeverity: "moderate",
    observation:
      "The water heater is approximately 14 years old, exceeding the typical 10–12 year service life. Corrosion is visible at the base.",
    recommendation:
      "Budget for water heater replacement. Have a plumber evaluate the unit and check the T&P relief valve.",
  },
  {
    id: "plumb-no-tpr",
    title: "Missing T&P relief valve discharge pipe",
    category: "Plumbing",
    defaultSeverity: "major",
    observation:
      "The water heater temperature and pressure relief valve discharge pipe is missing, undersized, or terminates incorrectly.",
    recommendation:
      "Install a properly sized discharge pipe that terminates within 6 inches of the floor or to the exterior per code.",
  },
  {
    id: "plumb-slow-drain",
    title: "Slow draining fixtures",
    category: "Plumbing",
    defaultSeverity: "minor",
    observation:
      "One or more sinks or tubs drain slowly, suggesting a partial blockage in the drain line.",
    recommendation:
      "Clear drain obstructions. If clearing the trap does not resolve the issue, have a plumber snake the drain line.",
  },
  {
    id: "plumb-shutoff-valve",
    title: "Inoperable main water shutoff valve",
    category: "Plumbing",
    defaultSeverity: "moderate",
    observation:
      "The main water shutoff valve is corroded and could not be fully operated, posing a risk in a plumbing emergency.",
    recommendation:
      "Have a licensed plumber replace the shutoff valve to ensure it can be operated when needed.",
  },
  // HVAC
  {
    id: "hvac-filter",
    title: "Dirty HVAC air filter",
    category: "HVAC",
    defaultSeverity: "minor",
    observation:
      "The air handler filter is heavily soiled, restricting airflow and reducing system efficiency.",
    recommendation:
      "Replace the filter and establish a routine 1–3 month replacement schedule.",
  },
  {
    id: "hvac-age",
    title: "HVAC system near end of service life",
    category: "HVAC",
    defaultSeverity: "moderate",
    observation:
      "The furnace and air handler appear to be approximately 18 years old, beyond the typical 15–20 year service life.",
    recommendation:
      "Budget for replacement and have an HVAC technician perform a full service evaluation.",
  },
  {
    id: "hvac-no-service",
    title: "No evidence of recent HVAC service",
    category: "HVAC",
    defaultSeverity: "minor",
    observation:
      "No service stickers or maintenance records were present on the HVAC equipment. The system showed signs of deferred maintenance.",
    recommendation:
      "Have an HVAC technician perform a full tune-up. Establish an annual service schedule.",
  },
  {
    id: "hvac-ductwork",
    title: "Disconnected or damaged ductwork",
    category: "HVAC",
    defaultSeverity: "moderate",
    observation:
      "One or more duct connections are loose, disconnected, or show visible damage, reducing heating and cooling efficiency.",
    recommendation:
      "Have an HVAC technician reconnect and seal all duct joints with mastic sealant or metal tape.",
  },
  // Structure
  {
    id: "struct-foundation-crack",
    title: "Foundation hairline crack",
    category: "Structure",
    defaultSeverity: "minor",
    observation:
      "A vertical hairline crack is present in the poured concrete foundation wall with no signs of active movement or water infiltration.",
    recommendation:
      "Monitor for changes and seal with hydraulic cement or epoxy injection. Consult a structural engineer if it widens.",
  },
  {
    id: "struct-stair-crack",
    title: "Stair-step crack in masonry foundation",
    category: "Structure",
    defaultSeverity: "moderate",
    observation:
      "A diagonal stair-step crack is present in the masonry block foundation, which may indicate differential settlement.",
    recommendation:
      "Consult a licensed structural engineer to evaluate the crack and determine if repair is needed.",
  },
  {
    id: "struct-crawlspace-moisture",
    title: "Moisture in crawlspace",
    category: "Structure",
    defaultSeverity: "moderate",
    observation:
      "Visible moisture, efflorescence, and staining were observed on crawlspace walls and floor. Wood components showed early signs of fungal growth.",
    recommendation:
      "Improve drainage and ventilation. Install a vapor barrier. Evaluate for mold and wood damage.",
  },
  {
    id: "struct-floor-bounce",
    title: "Excessive floor deflection",
    category: "Structure",
    defaultSeverity: "moderate",
    observation:
      "Noticeable bounce or deflection in the floor system was observed, suggesting undersized or damaged joists.",
    recommendation:
      "Have a structural engineer evaluate the floor system and install additional support if warranted.",
  },
  // Exterior
  {
    id: "ext-grading",
    title: "Negative grading at foundation",
    category: "Exterior",
    defaultSeverity: "moderate",
    observation:
      "Soil grading slopes toward the foundation on the east elevation, directing water toward the structure.",
    recommendation:
      "Regrade to slope away from the home at a minimum of 6 inches over 10 feet and extend downspout discharge.",
  },
  {
    id: "ext-siding-damage",
    title: "Damaged or missing siding",
    category: "Exterior",
    defaultSeverity: "moderate",
    observation:
      "Multiple sections of siding are cracked, warped, missing, or show wood rot, allowing moisture intrusion behind the wall cladding.",
    recommendation:
      "Replace damaged siding sections. Inspect and repair the underlying sheathing and weather-resistant barrier as needed.",
  },
  {
    id: "ext-deck-ledger",
    title: "Improperly attached deck ledger",
    category: "Exterior",
    defaultSeverity: "major",
    observation:
      "The deck ledger board shows inadequate fastening, missing flashing, and signs of moisture damage where it attaches to the house.",
    recommendation:
      "Have a licensed contractor evaluate and properly fasten the ledger with approved hardware and install proper flashing.",
  },
  {
    id: "ext-caulk",
    title: "Failed caulking at windows and doors",
    category: "Exterior",
    defaultSeverity: "minor",
    observation:
      "Caulking around exterior windows and door frames is cracked, shrinking, or missing, creating pathways for water and air infiltration.",
    recommendation:
      "Remove deteriorated caulk and apply a fresh bead of paintable exterior caulk at all window and door perimeters.",
  },
  // Interior
  {
    id: "int-window-seal",
    title: "Failed window thermal seal",
    category: "Interior",
    defaultSeverity: "minor",
    observation:
      "Condensation between panes indicates a failed thermal seal on one or more insulated glass units.",
    recommendation: "Replace the insulated glass unit(s) to restore thermal performance and clarity.",
  },
  {
    id: "int-smoke-alarm",
    title: "Missing or inoperable smoke alarm",
    category: "Interior",
    defaultSeverity: "major",
    observation:
      "Smoke alarms are absent in one or more required locations, or failed to respond when tested.",
    recommendation:
      "Install smoke alarms in all required locations per NFPA 72. Replace alarms older than 10 years.",
  },
  {
    id: "int-handrail",
    title: "Missing or non-graspable handrail",
    category: "Interior",
    defaultSeverity: "moderate",
    observation:
      "Stairway handrail is missing, loose, or not graspable in profile, creating a fall hazard.",
    recommendation:
      "Install or replace the handrail to meet current code requirements for height (34–38 inches) and graspability.",
  },
  {
    id: "int-moisture-stain",
    title: "Moisture staining at ceiling or wall",
    category: "Interior",
    defaultSeverity: "moderate",
    observation:
      "Moisture staining or discoloration was observed at an interior ceiling or wall surface. The source and current activity could not be fully determined during a visual inspection.",
    recommendation:
      "Identify and eliminate the moisture source. Evaluate for mold and repair or replace affected drywall as needed.",
  },
]

export interface Finding {
  id: string
  title: string
  category: string
  severity: Severity
  location: string
  observation: string
  recommendation: string
  photo?: string
}

export const SAMPLE_FINDINGS: Finding[] = [
  {
    id: "f1",
    title: "Curling & missing shingles",
    category: "Roofing",
    severity: "major",
    location: "Roof — South Slope",
    observation:
      "Multiple asphalt shingles on the south-facing slope are curling, lifting, and missing granules. Several shingles are absent near the ridge, exposing underlayment.",
    recommendation:
      "Have a licensed roofing contractor evaluate and repair or replace the affected sections to prevent water intrusion.",
    photo: "/inspection/defect-roof.png",
  },
  {
    id: "f2",
    title: "Double-tapped breakers",
    category: "Electrical",
    severity: "moderate",
    location: "Garage — Main Panel",
    observation:
      "Two circuit breakers in the main panel have two conductors landed on a single lug not rated for multiple wires.",
    recommendation:
      "A licensed electrician should correct the connections to manufacturer specifications.",
    photo: "/inspection/defect-electrical.png",
  },
  {
    id: "f3",
    title: "Active leak at supply connection",
    category: "Plumbing",
    severity: "major",
    location: "Kitchen — Under Sink",
    observation:
      "Active moisture and corrosion observed at the supply line connection beneath the kitchen sink.",
    recommendation:
      "Recommend a licensed plumber repair the connection and evaluate for cabinet and floor damage.",
    photo: "/inspection/defect-plumbing.png",
  },
  {
    id: "f4",
    title: "HVAC system near end of service life",
    category: "HVAC",
    severity: "moderate",
    location: "Basement — Mechanical Room",
    observation:
      "The furnace and air handler appear to be approximately 18 years old, beyond typical service life, with a heavily soiled filter.",
    recommendation:
      "Budget for replacement and have an HVAC technician perform a full service evaluation.",
    photo: "/inspection/defect-hvac.png",
  },
  {
    id: "f5",
    title: "Foundation hairline crack",
    category: "Structure",
    severity: "minor",
    location: "Basement — North Wall",
    observation:
      "A vertical hairline crack is present in the poured concrete foundation wall with no signs of active movement.",
    recommendation:
      "Monitor for changes and seal to limit moisture intrusion. Consult a structural engineer if it widens.",
    photo: "/inspection/defect-foundation.png",
  },
]

export interface ReportDetails {
  client: string
  address: string
  cityState: string
  date: string
  inspector: string
  license: string
  company: string
  coverPhoto: string
}

export const DEFAULT_REPORT_DETAILS: ReportDetails = {
  client: "",
  address: "",
  cityState: "",
  date: new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }),
  inspector: "",
  license: "",
  company: "",
  coverPhoto: "/inspection/cover-home.png",
}

export function severityCounts(findings: Finding[]) {
  return SEVERITY_ORDER.reduce(
    (acc, s) => {
      acc[s] = findings.filter((f) => f.severity === s).length
      return acc
    },
    { major: 0, moderate: 0, minor: 0, info: 0 } as Record<Severity, number>,
  )
}
