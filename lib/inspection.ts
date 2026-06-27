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
  // Roofing (additional)
  {
    id: "roof-age",
    title: "Roof at or near end of service life",
    category: "Roofing",
    defaultSeverity: "moderate",
    observation:
      "The asphalt shingle roof appears to be 20–25 years old and is exhibiting signs of significant weathering, granule loss, and brittleness consistent with end-of-life condition.",
    recommendation:
      "Budget for full roof replacement within the next 1–3 years. Obtain estimates from licensed roofing contractors.",
  },
  {
    id: "roof-ridge-cap",
    title: "Deteriorated ridge cap shingles",
    category: "Roofing",
    defaultSeverity: "moderate",
    observation:
      "Ridge cap shingles are cracked, lifting, or missing, leaving the ridge vulnerable to wind-driven rain and heat loss.",
    recommendation:
      "Replace ridge cap shingles and ensure proper nailing pattern and sealant application.",
  },
  {
    id: "roof-soffit-damage",
    title: "Damaged or missing soffit panels",
    category: "Roofing",
    defaultSeverity: "minor",
    observation:
      "Soffit panels are damaged, sagging, or missing at multiple locations, potentially allowing pest entry and moisture damage.",
    recommendation:
      "Replace damaged soffit panels and inspect for pest intrusion or moisture damage in the attic space.",
  },
  {
    id: "roof-attic-ventilation",
    title: "Inadequate attic ventilation",
    category: "Roofing",
    defaultSeverity: "moderate",
    observation:
      "Attic ventilation appears insufficient. Inadequate ventilation can cause heat and moisture buildup, reducing shingle life and promoting mold growth.",
    recommendation:
      "Have a roofing contractor evaluate and improve attic ventilation to meet minimum code ratios.",
  },
  {
    id: "roof-moss-algae",
    title: "Moss or algae growth on roof",
    category: "Roofing",
    defaultSeverity: "minor",
    observation:
      "Moss or algae growth is present on roof surfaces. Moss can retain moisture and accelerate shingle deterioration.",
    recommendation:
      "Apply a zinc sulfate or copper-based moss treatment. Consider zinc or copper ridge strips to prevent regrowth.",
  },
  {
    id: "roof-skylight-seal",
    title: "Skylight seal failure",
    category: "Roofing",
    defaultSeverity: "moderate",
    observation:
      "Staining and moisture evidence around skylight curbing suggests seal failure or improper flashing installation.",
    recommendation:
      "Have a roofing contractor re-flash and reseal the skylight. Evaluate interior for moisture damage.",
  },
  // Electrical (additional)
  {
    id: "elec-no-arc-fault",
    title: "Missing AFCI protection",
    category: "Electrical",
    defaultSeverity: "info",
    observation:
      "Arc fault circuit interrupter protection is not present in bedroom circuits, as required by current NEC code for newer construction.",
    recommendation:
      "Consult a licensed electrician regarding AFCI protection upgrade. Required for significant renovations.",
  },
  {
    id: "elec-overloaded-circuit",
    title: "Overloaded circuit — breaker oversized",
    category: "Electrical",
    defaultSeverity: "major",
    observation:
      "Wire gauge and breaker amperage are mismatched. Conductor insulation shows signs of heat damage.",
    recommendation:
      "Have a licensed electrician immediately correct the overcurrent protection to match wire gauge.",
  },
  {
    id: "elec-ungrounded",
    title: "Ungrounded 3-prong receptacles",
    category: "Electrical",
    defaultSeverity: "moderate",
    observation:
      "Three-prong receptacles are present but testing confirms they are not grounded, creating a shock and equipment damage risk.",
    recommendation:
      "Have a licensed electrician install proper grounding, GFCI protection, or replace with 2-prong receptacles.",
  },
  {
    id: "elec-reversed-polarity",
    title: "Reversed polarity at receptacle",
    category: "Electrical",
    defaultSeverity: "moderate",
    observation:
      "One or more receptacles tested as having reversed hot and neutral conductors, which can damage appliances and create shock hazards.",
    recommendation:
      "Have a licensed electrician correct the wiring at affected receptacles.",
  },
  {
    id: "elec-federal-pacific",
    title: "Federal Pacific / Zinsco panel identified",
    category: "Electrical",
    defaultSeverity: "major",
    observation:
      "The main electrical panel is a Federal Pacific Stab-Lok or Zinsco brand, which has a documented history of breaker failure and fire hazard.",
    recommendation:
      "Consult a licensed electrician to evaluate and budget for panel replacement with a listed, code-compliant unit.",
  },
  {
    id: "elec-no-co-alarm",
    title: "Missing carbon monoxide alarm",
    category: "Electrical",
    defaultSeverity: "major",
    observation:
      "No carbon monoxide alarms were observed in proximity to sleeping areas or fuel-burning appliances.",
    recommendation:
      "Install UL-listed CO alarms on each floor and within 15 feet of sleeping areas per NFPA 720.",
  },
  {
    id: "elec-exterior-gfci",
    title: "Missing GFCI at exterior receptacle",
    category: "Electrical",
    defaultSeverity: "moderate",
    observation:
      "Exterior receptacles lack GFCI protection and are not weatherproof, creating shock hazard in wet conditions.",
    recommendation:
      "Replace exterior receptacles with weatherproof GFCI units. Ensure in-use covers are installed.",
  },
  // Plumbing (additional)
  {
    id: "plumb-polybutylene",
    title: "Polybutylene supply piping",
    category: "Plumbing",
    defaultSeverity: "major",
    observation:
      "Gray polybutylene supply piping is present throughout the home. This material has a history of premature failure and catastrophic leaks.",
    recommendation:
      "Consult a licensed plumber to evaluate and budget for full repipe with copper or PEX piping.",
  },
  {
    id: "plumb-galvanized",
    title: "Galvanized steel supply piping",
    category: "Plumbing",
    defaultSeverity: "moderate",
    observation:
      "Galvanized steel water supply piping is present and showing signs of corrosion, tuberculation, and reduced flow.",
    recommendation:
      "Have a plumber evaluate water flow and pressure. Budget for repipe with copper or PEX.",
  },
  {
    id: "plumb-no-trap",
    title: "Missing or dry P-trap",
    category: "Plumbing",
    defaultSeverity: "moderate",
    observation:
      "A P-trap is absent or dry under one or more fixtures, allowing sewer gases to enter the living space.",
    recommendation:
      "Have a licensed plumber install or restore P-traps at all affected fixtures.",
  },
  {
    id: "plumb-water-pressure",
    title: "Abnormal water pressure",
    category: "Plumbing",
    defaultSeverity: "moderate",
    observation:
      "Water pressure measured outside the normal 40–80 PSI range, which can stress supply lines, fixtures, and appliances.",
    recommendation:
      "Have a licensed plumber install or adjust a pressure reducing valve to bring supply pressure within the safe range.",
  },
  {
    id: "plumb-sewer-odor",
    title: "Sewer gas odor detected",
    category: "Plumbing",
    defaultSeverity: "major",
    observation:
      "Sewer gas odor was detected in one or more areas, suggesting a missing trap, failed wax ring, cracked vent pipe, or other drain system defect.",
    recommendation:
      "Have a licensed plumber investigate and correct the source of sewer gas intrusion immediately.",
  },
  {
    id: "plumb-hose-bib",
    title: "Hose bib not frost-protected",
    category: "Plumbing",
    defaultSeverity: "minor",
    observation:
      "Exterior hose bibs are standard (non-frost-free) type, which are susceptible to freeze damage if not properly shut off and drained each winter.",
    recommendation:
      "Replace with frost-free sillcocks or ensure interior shutoff valves are installed and accessible.",
  },
  // HVAC (additional)
  {
    id: "hvac-ac-age",
    title: "Air conditioner at end of service life",
    category: "HVAC",
    defaultSeverity: "moderate",
    observation:
      "The central air conditioning condenser unit is approximately 16–18 years old, beyond the typical 12–15 year service life for central AC.",
    recommendation:
      "Budget for replacement. Have an HVAC technician perform a full assessment and refrigerant check.",
  },
  {
    id: "hvac-flue-clearance",
    title: "Insufficient flue clearance",
    category: "HVAC",
    defaultSeverity: "major",
    observation:
      "The furnace or water heater flue pipe lacks required clearance from combustibles, posing a fire hazard.",
    recommendation:
      "Have a licensed HVAC technician or plumber correct flue clearances to meet manufacturer and code requirements.",
  },
  {
    id: "hvac-carbon-monoxide",
    title: "Cracked heat exchanger — CO risk",
    category: "HVAC",
    defaultSeverity: "major",
    observation:
      "Visual inspection and flame test suggest a cracked or failed heat exchanger, which can allow combustion gases including carbon monoxide to enter the living space.",
    recommendation:
      "Immediately discontinue use of the furnace. Have a licensed HVAC technician verify and replace the heat exchanger or unit.",
  },
  {
    id: "hvac-condensate",
    title: "Condensate drain line not draining",
    category: "HVAC",
    defaultSeverity: "minor",
    observation:
      "The HVAC condensate drain pan shows standing water or staining, suggesting a clogged or improperly sloped drain line.",
    recommendation:
      "Clear and flush the condensate drain line. Ensure the secondary drain pan and float switch are functional.",
  },
  {
    id: "hvac-refrigerant-leak",
    title: "Possible refrigerant leak",
    category: "HVAC",
    defaultSeverity: "moderate",
    observation:
      "Oily residue and reduced cooling performance suggest a possible refrigerant leak at the air conditioning unit.",
    recommendation:
      "Have a licensed HVAC technician inspect, identify, and repair the leak and recharge the system.",
  },
  // Structure (additional)
  {
    id: "struct-wood-rot",
    title: "Wood rot at structural member",
    category: "Structure",
    defaultSeverity: "major",
    observation:
      "Significant wood rot was identified at one or more structural members. Probing confirms soft, deteriorated wood that has lost structural integrity.",
    recommendation:
      "Have a licensed contractor evaluate the extent of rot and repair or sister the affected members.",
  },
  {
    id: "struct-termite-damage",
    title: "Evidence of wood-destroying insect damage",
    category: "Structure",
    defaultSeverity: "major",
    observation:
      "Mud tubes, frass, or structural damage consistent with termite or other wood-destroying insect activity was observed.",
    recommendation:
      "Have a licensed pest control operator perform a Wood Destroying Insect inspection and treat as needed. Repair structural damage.",
  },
  {
    id: "struct-attic-sheathing",
    title: "Roof sheathing damage or delamination",
    category: "Structure",
    defaultSeverity: "moderate",
    observation:
      "Roof sheathing panels in the attic show signs of moisture damage, delamination, or mold staining.",
    recommendation:
      "Have a roofing contractor evaluate and replace affected sheathing panels before re-roofing.",
  },
  {
    id: "struct-beam-notch",
    title: "Improper notch or bore in structural member",
    category: "Structure",
    defaultSeverity: "moderate",
    observation:
      "A structural beam or joist has been notched or bored beyond code-allowable limits for utilities, reducing its load capacity.",
    recommendation:
      "Have a structural engineer evaluate the modification and determine if reinforcement is required.",
  },
  {
    id: "struct-post-base",
    title: "Deck post not anchored to footing",
    category: "Structure",
    defaultSeverity: "major",
    observation:
      "Deck support posts are resting on footings without mechanical anchors, creating a risk of lateral movement or uplift failure.",
    recommendation:
      "Have a licensed contractor install approved post base hardware at all deck support posts.",
  },
  // Exterior (additional)
  {
    id: "ext-driveway-crack",
    title: "Significant driveway or walkway cracking",
    category: "Exterior",
    defaultSeverity: "minor",
    observation:
      "The driveway or walkway shows significant cracking, heaving, or settlement creating trip hazards and allowing water infiltration.",
    recommendation:
      "Repair or replace the affected sections. Seal cracks to limit water infiltration and freeze-thaw damage.",
  },
  {
    id: "ext-garage-door",
    title: "Garage door auto-reverse not functioning",
    category: "Exterior",
    defaultSeverity: "major",
    observation:
      "The garage door opener did not auto-reverse when tested with an obstruction, as required by safety standards.",
    recommendation:
      "Adjust or replace the garage door opener to ensure auto-reverse and photoelectric sensor functions meet current safety requirements.",
  },
  {
    id: "ext-retaining-wall",
    title: "Failing retaining wall",
    category: "Exterior",
    defaultSeverity: "moderate",
    observation:
      "The retaining wall shows signs of leaning, cracking, or displacement, suggesting inadequate drainage or structural failure.",
    recommendation:
      "Have a qualified contractor evaluate the wall and soil conditions. Repair or rebuild as recommended.",
  },
  {
    id: "ext-wood-soil-contact",
    title: "Wood-to-soil contact",
    category: "Exterior",
    defaultSeverity: "moderate",
    observation:
      "Wood siding, trim, or structural members are in direct contact with soil, promoting moisture absorption, rot, and termite entry.",
    recommendation:
      "Trim back soil from wood members. Maintain a minimum 6-inch clearance between soil and wood.",
  },
  {
    id: "ext-fence",
    title: "Fence in disrepair",
    category: "Exterior",
    defaultSeverity: "minor",
    observation:
      "Sections of perimeter fencing are leaning, damaged, or have missing boards, reducing security and aesthetics.",
    recommendation:
      "Repair or replace damaged fence sections. Ensure all gate latches operate properly.",
  },
  {
    id: "ext-downspout-discharge",
    title: "Downspout discharges at foundation",
    category: "Exterior",
    defaultSeverity: "moderate",
    observation:
      "One or more downspouts discharge water directly at the foundation, potentially leading to basement moisture and foundation settlement.",
    recommendation:
      "Extend downspout discharge at least 6 feet from the foundation using extensions or underground drainage.",
  },
  // Interior (additional)
  {
    id: "int-co-alarm",
    title: "Missing CO alarm near sleeping areas",
    category: "Interior",
    defaultSeverity: "major",
    observation:
      "No carbon monoxide detector is installed within the required distance of sleeping areas.",
    recommendation:
      "Install UL-listed combination smoke/CO alarms within 15 feet of each sleeping area.",
  },
  {
    id: "int-door-fire-rating",
    title: "Garage-to-living-space door not fire-rated",
    category: "Interior",
    defaultSeverity: "major",
    observation:
      "The door between the attached garage and living space is not a solid-core, fire-rated assembly, lacking the required fire separation.",
    recommendation:
      "Replace the door with a solid-core or fire-rated door with self-closing hardware per IRC requirements.",
  },
  {
    id: "int-bathroom-fan",
    title: "Bathroom exhaust fan venting into attic",
    category: "Interior",
    defaultSeverity: "moderate",
    observation:
      "The bathroom exhaust fan is discharging into the attic rather than to the exterior, promoting moisture buildup and potential mold growth.",
    recommendation:
      "Reroute the exhaust duct to terminate at an exterior wall or roof vent.",
  },
  {
    id: "int-dryer-vent",
    title: "Dryer vent discharging into crawlspace or attic",
    category: "Interior",
    defaultSeverity: "major",
    observation:
      "The clothes dryer exhaust duct terminates in the crawlspace or attic rather than the exterior, creating a fire and moisture hazard.",
    recommendation:
      "Reroute the dryer vent to discharge directly to the exterior using rigid metal ductwork.",
  },
  {
    id: "int-egress-window",
    title: "Bedroom window below egress requirements",
    category: "Interior",
    defaultSeverity: "moderate",
    observation:
      "One or more bedroom windows do not meet minimum egress requirements for opening width, height, or net clear opening area.",
    recommendation:
      "Consult a contractor about replacing or modifying windows to meet IRC egress requirements for sleeping rooms.",
  },
  {
    id: "int-attic-insulation",
    title: "Insufficient attic insulation",
    category: "Interior",
    defaultSeverity: "minor",
    observation:
      "Attic insulation depth appears below current energy code recommendations, resulting in heat loss and higher energy costs.",
    recommendation:
      "Add insulation to achieve a minimum R-38 to R-60 value per current energy code for this climate zone.",
  },
  {
    id: "int-subfloor-damage",
    title: "Damaged subfloor at wet area",
    category: "Interior",
    defaultSeverity: "moderate",
    observation:
      "Soft or springy subfloor was detected at a bathroom or kitchen wet area, indicating moisture damage or rot.",
    recommendation:
      "Have a contractor investigate and repair the subfloor, addressing the source of moisture before closing up the floor.",
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
