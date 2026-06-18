from __future__ import annotations

import json
import re
import shutil
import tempfile
from collections import defaultdict
from datetime import date, datetime
from html import escape
from pathlib import Path
from typing import Any

import streamlit as st
from PIL import Image
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    Image as ReportImage,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
REPORTS_DIR = DATA_DIR / "reports"
EXPORTS_DIR = BASE_DIR / "exports"
ASSETS_DIR = BASE_DIR / "assets"
INSPECTION_ASSETS_DIR = ASSETS_DIR / "inspection"
DEFECT_LIBRARY_PATH = DATA_DIR / "defect_library_home.json"

SECTIONS = [
    "Roof",
    "Exterior",
    "Structure",
    "Electrical",
    "Plumbing",
    "HVAC",
    "Interior",
    "Kitchen",
    "Bathrooms",
    "Safety",
    "Limitations",
]

SEVERITIES = ["Major", "Moderate", "Minor", "Informational"]
SEVERITY_COLORS = {
    "Major": colors.HexColor("#dc3f3f"),
    "Moderate": colors.HexColor("#d98b2b"),
    "Minor": colors.HexColor("#d9bd36"),
    "Informational": colors.HexColor("#4f9cff"),
}
UI_SEVERITY = {
    "Major": {"short": "Major", "hex": "#dc3f3f", "soft": "rgba(220, 63, 63, .14)"},
    "Moderate": {"short": "Moderate", "hex": "#d98b2b", "soft": "rgba(217, 139, 43, .16)"},
    "Minor": {"short": "Minor", "hex": "#d9bd36", "soft": "rgba(217, 189, 54, .14)"},
    "Informational": {"short": "Info", "hex": "#4f9cff", "soft": "rgba(79, 156, 255, .14)"},
}
CATEGORY_ASSETS = {
    "Roof": "defect-roof.png",
    "Roofing": "defect-roof.png",
    "Electrical": "defect-electrical.png",
    "Plumbing": "defect-plumbing.png",
    "HVAC": "defect-hvac.png",
    "Structure": "defect-foundation.png",
    "Exterior": "cover-home.png",
    "Interior": "defect-foundation.png",
    "Kitchen": "defect-plumbing.png",
    "Bathrooms": "defect-plumbing.png",
    "Safety": "defect-electrical.png",
}


def ensure_directories() -> None:
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    EXPORTS_DIR.mkdir(parents=True, exist_ok=True)
    ASSETS_DIR.mkdir(parents=True, exist_ok=True)


@st.cache_data
def load_defect_library() -> list[dict[str, Any]]:
    if not DEFECT_LIBRARY_PATH.exists():
        return []
    return json.loads(DEFECT_LIBRARY_PATH.read_text(encoding="utf-8"))


def slugify(value: str) -> str:
    value = value.lower().strip()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-") or "inspection-report"


def save_uploaded_file(uploaded_file: Any, report_id: str, folder_name: str) -> str | None:
    if uploaded_file is None:
        return None

    folder = REPORTS_DIR / report_id / folder_name
    folder.mkdir(parents=True, exist_ok=True)
    safe_name = slugify(Path(uploaded_file.name).stem) + Path(uploaded_file.name).suffix.lower()
    destination = folder / safe_name
    uploaded_file.seek(0)
    with destination.open("wb") as output:
        shutil.copyfileobj(uploaded_file, output)
    return str(destination)


def image_flowable(path: str, max_width: float, max_height: float) -> ReportImage | None:
    try:
        with Image.open(path) as image:
            width, height = image.size
    except Exception:
        return None

    ratio = min(max_width / width, max_height / height)
    return ReportImage(path, width=width * ratio, height=height * ratio)


def pdf_text(value: Any) -> str:
    return escape(str(value or ""))


def build_report_payload(report_meta: dict[str, Any], findings: list[dict[str, Any]]) -> dict[str, Any]:
    report_id = f"{datetime.now().strftime('%Y%m%d-%H%M%S')}-{slugify(report_meta['client_name'])}"
    return {
        "id": report_id,
        "created_at": datetime.now().isoformat(timespec="seconds"),
        "report": report_meta,
        "findings": findings,
    }


def save_report_json(payload: dict[str, Any]) -> Path:
    report_folder = REPORTS_DIR / payload["id"]
    report_folder.mkdir(parents=True, exist_ok=True)
    output_path = report_folder / "report.json"
    output_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
    return output_path


def generate_pdf(payload: dict[str, Any]) -> Path:
    report = payload["report"]
    findings = payload["findings"]
    output_path = EXPORTS_DIR / f"{payload['id']}.pdf"

    doc = SimpleDocTemplate(
        str(output_path),
        pagesize=letter,
        rightMargin=0.65 * inch,
        leftMargin=0.65 * inch,
        topMargin=0.65 * inch,
        bottomMargin=0.65 * inch,
    )
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name="CoverTitle", parent=styles["Title"], fontSize=28, leading=34, alignment=TA_CENTER))
    styles.add(ParagraphStyle(name="SectionTitle", parent=styles["Heading2"], spaceBefore=18, spaceAfter=8))
    styles.add(ParagraphStyle(name="SmallMuted", parent=styles["Normal"], textColor=colors.HexColor("#52606d"), fontSize=9))

    story: list[Any] = []

    logo = report.get("company_logo_path") or str(ASSETS_DIR / "logo_placeholder.png")
    logo_image = image_flowable(logo, max_width=2.2 * inch, max_height=0.9 * inch)
    if logo_image:
        story.append(logo_image)
        story.append(Spacer(1, 0.4 * inch))

    story.append(Paragraph("Home Inspection Report", styles["CoverTitle"]))
    story.append(Spacer(1, 0.25 * inch))
    story.append(Paragraph(pdf_text(report["property_address"]), styles["Heading2"]))
    story.append(Paragraph(f"Client: {pdf_text(report['client_name'])}", styles["Normal"]))
    story.append(Paragraph(f"Inspection Date: {pdf_text(report['inspection_date'])}", styles["Normal"]))
    story.append(Paragraph(f"Inspector: {pdf_text(report['inspector_name'])}", styles["Normal"]))
    story.append(Paragraph(f"Company: {pdf_text(report['company_name'])}", styles["Normal"]))
    story.append(Spacer(1, 0.35 * inch))

    cover_photo = report.get("cover_photo_path")
    cover_image = image_flowable(cover_photo, max_width=6.6 * inch, max_height=3.7 * inch) if cover_photo else None
    if cover_image:
        story.append(cover_image)

    story.append(PageBreak())
    story.append(Paragraph("Executive Summary", styles["SectionTitle"]))
    story.append(Paragraph("Findings grouped by severity.", styles["SmallMuted"]))

    by_severity: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for finding in findings:
        by_severity[finding["severity"]].append(finding)

    for severity in SEVERITIES:
        severity_findings = by_severity.get(severity, [])
        story.append(Spacer(1, 0.12 * inch))
        story.append(Paragraph(f"{severity} ({len(severity_findings)})", styles["Heading3"]))
        if severity_findings:
            rows = [["Category", "Location", "Finding"]]
            rows.extend(
                [
                    [pdf_text(item["category"]), pdf_text(item.get("location", "Unspecified")), pdf_text(item["title"])]
                    for item in severity_findings
                ]
            )
            table = Table(rows, colWidths=[1.25 * inch, 1.55 * inch, 3.4 * inch])
            table.setStyle(
                TableStyle(
                    [
                        ("BACKGROUND", (0, 0), (-1, 0), SEVERITY_COLORS[severity]),
                        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                        ("GRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#d9e2ec")),
                        ("VALIGN", (0, 0), (-1, -1), "TOP"),
                        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                    ]
                )
            )
            story.append(table)
        else:
            story.append(Paragraph("No findings.", styles["Normal"]))

    story.append(PageBreak())
    story.append(Paragraph("Detailed Sections", styles["SectionTitle"]))

    for section in SECTIONS:
        section_findings = [finding for finding in findings if finding["category"] == section]
        story.append(Paragraph(pdf_text(section), styles["Heading2"]))
        if not section_findings:
            story.append(Paragraph("No findings documented for this section.", styles["SmallMuted"]))
            continue

        for finding in section_findings:
            story.append(Spacer(1, 0.1 * inch))
            story.append(Paragraph(pdf_text(finding["title"]), styles["Heading3"]))
            story.append(Paragraph(f"Severity: {pdf_text(finding['severity'])}", styles["Normal"]))
            story.append(Paragraph(f"Location: {pdf_text(finding.get('location', 'Unspecified'))}", styles["Normal"]))
            story.append(Paragraph(f"<b>Observation:</b> {pdf_text(finding['observation'])}", styles["Normal"]))
            story.append(Paragraph(f"<b>Recommendation:</b> {pdf_text(finding['recommendation'])}", styles["Normal"]))
            if finding.get("notes"):
                story.append(Paragraph(f"<b>Notes:</b> {pdf_text(finding['notes'])}", styles["Normal"]))
            for photo_path in finding.get("photo_paths", []):
                photo = image_flowable(photo_path, max_width=3.1 * inch, max_height=2.2 * inch)
                if photo:
                    story.append(Spacer(1, 0.08 * inch))
                    story.append(photo)

    story.append(PageBreak())
    story.append(Paragraph("Final Recommendations", styles["SectionTitle"]))
    story.append(
        Paragraph(
            "Major and Moderate findings should be evaluated by qualified professionals before the end of the inspection contingency period.",
            styles["Normal"],
        )
    )
    story.append(Spacer(1, 0.2 * inch))
    story.append(Paragraph("Limitations", styles["SectionTitle"]))
    story.append(
        Paragraph(
            pdf_text(report.get("limitations"))
            or "This is a limited visual inspection of readily accessible systems and components. Hidden conditions, concealed defects, and code compliance are beyond the scope of this report.",
            styles["Normal"],
        )
    )

    doc.build(story)
    return output_path


def initialize_state() -> None:
    st.session_state.setdefault("findings", [])
    st.session_state.setdefault("category", "Roof")
    st.session_state.setdefault("severity", "Moderate")
    st.session_state.setdefault("title", "")
    st.session_state.setdefault("location", "")
    st.session_state.setdefault("observation", "")
    st.session_state.setdefault("recommendation", "")
    st.session_state.setdefault("notes", "")
    st.session_state.setdefault("last_json_path", "")
    st.session_state.setdefault("last_pdf_path", "")


def inject_css() -> None:
    st.markdown(
        """
        <style>
        :root {
            --ib-bg: #151b24;
            --ib-panel: #1b222d;
            --ib-panel-2: #202936;
            --ib-sidebar: #111720;
            --ib-border: rgba(255,255,255,.09);
            --ib-muted: #9ba8b8;
            --ib-text: #f6f8fb;
            --ib-blue: #4f9cff;
            --ib-blue-2: #2f7df2;
        }
        html, body, [data-testid="stAppViewContainer"] {
            background: radial-gradient(circle at top left, rgba(79,156,255,.12), transparent 32rem), var(--ib-bg);
            color: var(--ib-text);
        }
        [data-testid="stSidebar"] {
            background: linear-gradient(180deg, #111720 0%, #0d1219 100%);
            border-right: 1px solid var(--ib-border);
        }
        [data-testid="stSidebar"] * { color: var(--ib-text); }
        [data-testid="stSidebar"] label, [data-testid="stSidebar"] p, [data-testid="stSidebar"] span {
            color: #d8dee8;
        }
        .block-container {
            max-width: 1180px;
            padding-top: 1.15rem;
            padding-bottom: 3rem;
        }
        h1, h2, h3 { letter-spacing: -.025em; }
        [data-testid="stHeader"] { background: rgba(21,27,36,.72); backdrop-filter: blur(14px); }
        div[data-testid="stTabs"] button {
            border-radius: 10px;
            color: var(--ib-muted);
            font-weight: 650;
        }
        div[data-testid="stTabs"] button[aria-selected="true"] {
            background: rgba(255,255,255,.08);
            color: var(--ib-text);
        }
        div[data-testid="stMetric"] {
            background: var(--ib-panel);
            border: 1px solid var(--ib-border);
            border-radius: 14px;
            padding: 1rem;
            box-shadow: 0 16px 50px rgba(0,0,0,.16);
        }
        div[data-testid="stMetric"] label { color: var(--ib-muted); }
        div[data-testid="stMetricValue"] { color: var(--ib-text); }
        [data-testid="stVerticalBlockBorderWrapper"] {
            border-color: var(--ib-border) !important;
            border-radius: 14px !important;
            background: rgba(27,34,45,.84);
        }
        .stButton > button, .stDownloadButton > button {
            border-radius: 10px;
            border: 1px solid rgba(255,255,255,.12);
            font-weight: 700;
        }
        .stButton > button[kind="primary"], .stDownloadButton > button[kind="primary"] {
            background: linear-gradient(135deg, var(--ib-blue), var(--ib-blue-2));
            border: 0;
            color: white;
            box-shadow: 0 14px 36px rgba(47,125,242,.28);
        }
        .ib-kicker { color: var(--ib-blue); font-size: .9rem; font-weight: 800; margin-bottom: .25rem; }
        .ib-title { font-size: 2rem; line-height: 1.1; font-weight: 800; color: var(--ib-text); margin: 0; }
        .ib-muted { color: var(--ib-muted); }
        .ib-card {
            background: var(--ib-panel);
            border: 1px solid var(--ib-border);
            border-radius: 14px;
            padding: 1rem;
            box-shadow: 0 16px 50px rgba(0,0,0,.15);
        }
        .ib-section-label {
            color: var(--ib-muted);
            font-size: .72rem;
            text-transform: uppercase;
            letter-spacing: .11em;
            font-weight: 800;
            margin: 1rem 0 .45rem;
        }
        .ib-brand {
            display: flex;
            gap: .75rem;
            align-items: center;
            padding: .35rem 0 1rem;
            border-bottom: 1px solid var(--ib-border);
            margin-bottom: 1rem;
        }
        .ib-logo {
            width: 2.25rem;
            height: 2.25rem;
            display: grid;
            place-items: center;
            border-radius: .7rem;
            background: linear-gradient(135deg, var(--ib-blue), var(--ib-blue-2));
            color: white;
            font-weight: 900;
        }
        .ib-detail {
            border-radius: 10px;
            padding: .65rem .7rem;
            background: rgba(255,255,255,.035);
            border: 1px solid rgba(255,255,255,.055);
            margin-bottom: .45rem;
        }
        .ib-detail-label {
            color: var(--ib-muted);
            font-size: .68rem;
            text-transform: uppercase;
            letter-spacing: .08em;
            font-weight: 800;
        }
        .ib-detail-value { color: var(--ib-text); font-weight: 700; font-size: .88rem; }
        .ib-badge {
            display: inline-flex;
            align-items: center;
            border-radius: 999px;
            padding: .18rem .55rem;
            font-size: .72rem;
            font-weight: 800;
            letter-spacing: .01em;
        }
        .ib-finding-title { font-size: 1rem; font-weight: 800; color: var(--ib-text); margin: .25rem 0 .1rem; }
        .ib-finding-body { color: var(--ib-muted); font-size: .9rem; line-height: 1.45; margin: .4rem 0 0; }
        .ib-bar {
            display: flex;
            height: .65rem;
            overflow: hidden;
            border-radius: 999px;
            background: rgba(255,255,255,.08);
        }
        .ib-paper {
            background: #ffffff;
            color: #1f2733;
            border-radius: 4px;
            box-shadow: 0 24px 70px rgba(0,0,0,.38);
            border: 1px solid rgba(0,0,0,.08);
            padding: 2rem;
            margin-bottom: 1.5rem;
        }
        .ib-paper * { color: #1f2733; }
        .ib-paper-muted { color: #7a8594 !important; }
        .ib-paper-cover {
            min-height: 260px;
            border-radius: 4px;
            background: linear-gradient(145deg, #132033, #29456e);
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            padding: 2rem;
            margin: -2rem -2rem 1.5rem;
        }
        .ib-paper-cover * { color: white; }
        </style>
        """,
        unsafe_allow_html=True,
    )


def h(value: Any) -> str:
    return escape(str(value or ""))


def severity_badge(severity: str) -> str:
    meta = UI_SEVERITY.get(severity, UI_SEVERITY["Informational"])
    return (
        f"<span class='ib-badge' style='background:{meta['soft']}; "
        f"color:{meta['hex']}; border:1px solid {meta['hex']}55'>{meta['short']}</span>"
    )


def severity_counts(findings: list[dict[str, Any]]) -> dict[str, int]:
    return {severity: sum(1 for finding in findings if finding.get("severity") == severity) for severity in SEVERITIES}


def asset_for_category(category: str) -> Path:
    filename = CATEGORY_ASSETS.get(category, "cover-home.png")
    return INSPECTION_ASSETS_DIR / filename


def first_photo_for_finding(finding: dict[str, Any]) -> str | Path:
    temp_paths = finding.get("temp_photo_paths") or []
    if temp_paths:
        return temp_paths[0]
    photo_paths = finding.get("photo_paths") or []
    if photo_paths:
        return photo_paths[0]
    return asset_for_category(finding.get("category", "Roof"))


def render_sidebar_summary(
    client_name: str,
    property_address: str,
    inspection_date: date,
    inspector_name: str,
    company_name: str,
    cover_photo: Any,
) -> None:
    st.sidebar.markdown(
        """
        <div class="ib-brand">
          <div class="ib-logo">IB</div>
          <div>
            <div style="font-weight:800;">InspectionBuilder</div>
            <div class="ib-muted" style="font-size:.78rem;">Report Studio</div>
          </div>
        </div>
        """,
        unsafe_allow_html=True,
    )
    st.sidebar.image(cover_photo if cover_photo else str(INSPECTION_ASSETS_DIR / "cover-home.png"), use_container_width=True)
    st.sidebar.markdown("<div class='ib-section-label'>Report Details</div>", unsafe_allow_html=True)
    for label, value in [
        ("Client", client_name),
        ("Property Address", property_address),
        ("Inspection Date", inspection_date.strftime("%B %d, %Y")),
        ("Inspector", inspector_name),
        ("Company", company_name),
    ]:
        st.sidebar.markdown(
            f"<div class='ib-detail'><div class='ib-detail-label'>{label}</div><div class='ib-detail-value'>{h(value)}</div></div>",
            unsafe_allow_html=True,
        )

    counts = severity_counts(st.session_state["findings"])
    st.sidebar.markdown("<div class='ib-section-label'>Findings</div>", unsafe_allow_html=True)
    for severity in SEVERITIES:
        meta = UI_SEVERITY[severity]
        st.sidebar.markdown(
            f"""
            <div style="display:flex;align-items:center;justify-content:space-between;padding:.35rem .2rem;">
              <span style="display:flex;gap:.55rem;align-items:center;">
                <span style="width:.55rem;height:.55rem;border-radius:999px;background:{meta['hex']};"></span>
                {meta['short']}
              </span>
              <strong>{counts[severity]}</strong>
            </div>
            """,
            unsafe_allow_html=True,
        )

    completed_sections = len({finding.get("category") for finding in st.session_state["findings"]})
    completion = min(100, round((completed_sections / 9) * 100)) if completed_sections else 0
    st.sidebar.markdown(
        f"""
        <div class="ib-card" style="margin-top:1rem;padding:.8rem;">
          <div style="display:flex;justify-content:space-between;gap:1rem;">
            <strong>Report {completion}% complete</strong>
            <span class="ib-muted">{completed_sections}/9</span>
          </div>
          <div style="height:.45rem;background:rgba(255,255,255,.08);border-radius:999px;margin-top:.7rem;overflow:hidden;">
            <div style="height:100%;width:{completion}%;background:linear-gradient(90deg,#4f9cff,#2f7df2);"></div>
          </div>
          <div class="ib-muted" style="font-size:.78rem;margin-top:.55rem;">Professional home inspection template</div>
        </div>
        """,
        unsafe_allow_html=True,
    )


def persist_and_generate_report(
    report_meta: dict[str, Any],
    findings: list[dict[str, Any]],
    company_logo: Any,
    cover_photo: Any,
) -> tuple[Path, Path]:
    payload = build_report_payload(report_meta, findings)
    report_id = payload["id"]

    report_meta["company_logo_path"] = save_uploaded_file(company_logo, report_id, "logo")
    report_meta["cover_photo_path"] = save_uploaded_file(cover_photo, report_id, "cover")

    persisted_findings = []
    for finding_index, finding in enumerate(findings, start=1):
        photo_paths = []
        finding_folder = REPORTS_DIR / report_id / f"finding-{finding_index}-photos"
        finding_folder.mkdir(parents=True, exist_ok=True)
        for temp_path in finding.get("temp_photo_paths", []):
            source = Path(temp_path)
            destination = finding_folder / source.name
            if source.exists():
                shutil.copy2(source, destination)
                photo_paths.append(str(destination))
        clean_finding = {key: value for key, value in finding.items() if key != "temp_photo_paths"}
        clean_finding["photo_paths"] = photo_paths
        persisted_findings.append(clean_finding)

    payload["report"] = report_meta
    payload["findings"] = persisted_findings
    json_path = save_report_json(payload)
    pdf_path = generate_pdf(payload)
    st.session_state["last_json_path"] = str(json_path)
    st.session_state["last_pdf_path"] = str(pdf_path)
    return json_path, pdf_path


def render_generate_result() -> None:
    if st.session_state["last_pdf_path"]:
        pdf_path = Path(st.session_state["last_pdf_path"])
        json_path = Path(st.session_state["last_json_path"])
        st.success("Report saved and PDF generated.")
        st.write(f"JSON: `{json_path}`")
        st.write(f"PDF: `{pdf_path}`")
        if pdf_path.exists():
            with pdf_path.open("rb") as pdf_file:
                st.download_button("Download PDF", pdf_file, file_name=pdf_path.name, mime="application/pdf")


def add_finding_from_form(photos: list[Any] | None, category: str, severity: str, title: str, location: str, observation: str, recommendation: str, notes: str) -> None:
    temp_photo_paths = []
    for photo in photos or []:
        suffix = Path(photo.name).suffix.lower() or ".jpg"
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
        photo.seek(0)
        shutil.copyfileobj(photo, temp_file)
        temp_file.close()
        temp_photo_paths.append(temp_file.name)

    st.session_state["findings"].append(
        {
            "category": category,
            "severity": severity,
            "title": title,
            "location": location or "Unspecified location",
            "observation": observation,
            "recommendation": recommendation,
            "notes": notes,
            "temp_photo_paths": temp_photo_paths,
        }
    )


def render_dashboard(property_address: str) -> None:
    findings = st.session_state["findings"]
    counts = severity_counts(findings)
    photos = sum(1 for finding in findings if finding.get("temp_photo_paths") or finding.get("photo_paths"))
    systems = len({finding.get("category") for finding in findings}) or 0

    st.markdown("<div class='ib-kicker'>Inspection Report</div>", unsafe_allow_html=True)
    st.markdown(f"<h1 class='ib-title'>{h(property_address)}</h1>", unsafe_allow_html=True)
    st.markdown("<div class='ib-muted'>Single family home inspection workspace</div>", unsafe_allow_html=True)

    metric_cols = st.columns(4)
    metric_cols[0].metric("Total Findings", len(findings), "Across all systems")
    metric_cols[1].metric("Major Defects", counts["Major"], "Need immediate attention")
    metric_cols[2].metric("Photos Captured", photos, "Documented evidence")
    metric_cols[3].metric("Systems Covered", systems, "Per inspection standards")

    st.markdown("<br>", unsafe_allow_html=True)
    total = max(len(findings), 1)
    segments = "".join(
        f"<div style='width:{(counts[severity] / total) * 100}%;background:{UI_SEVERITY[severity]['hex']};'></div>"
        for severity in SEVERITIES
        if counts[severity] > 0
    )
    if not segments:
        segments = "<div style='width:100%;background:rgba(255,255,255,.08);'></div>"
    legend = " &nbsp; ".join(
        f"<span style='color:#9ba8b8;'><span style='color:{UI_SEVERITY[s]['hex']};'>●</span> {UI_SEVERITY[s]['short']} <strong style='color:#f6f8fb;'>{counts[s]}</strong></span>"
        for s in SEVERITIES
    )
    st.markdown(
        f"""
        <div class="ib-card">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <strong>Severity Distribution</strong>
            <span class="ib-muted">{len(findings)} findings</span>
          </div>
          <div class="ib-bar" style="margin-top:.9rem;">{segments}</div>
          <div style="margin-top:.8rem;font-size:.84rem;">{legend}</div>
        </div>
        """,
        unsafe_allow_html=True,
    )

    st.markdown("### Findings")
    search = st.text_input("Search findings", placeholder="Search by title, category, location...", label_visibility="collapsed")
    visible = [
        finding
        for finding in findings
        if not search
        or search.lower()
        in " ".join(
            [
                finding.get("category", ""),
                finding.get("severity", ""),
                finding.get("title", ""),
                finding.get("location", ""),
                finding.get("observation", ""),
            ]
        ).lower()
    ]

    if not visible:
        st.info("No findings yet. Add one from the defect library to start shaping the report.")
        return

    for index, finding in enumerate(visible):
        with st.container(border=True):
            image_col, body_col, action_col = st.columns([0.22, 0.66, 0.12], vertical_alignment="center")
            image_col.image(first_photo_for_finding(finding), use_container_width=True)
            body_col.markdown(
                f"""
                {severity_badge(finding.get("severity", "Informational"))}
                <span class="ib-muted" style="font-size:.78rem;margin-left:.5rem;">{h(finding.get("category"))}</span>
                <div class="ib-finding-title">{h(finding.get("title"))}</div>
                <div class="ib-muted" style="font-size:.8rem;">{h(finding.get("location", "Unspecified location"))}</div>
                <p class="ib-finding-body">{h(finding.get("observation"))}</p>
                """,
                unsafe_allow_html=True,
            )
            original_index = st.session_state["findings"].index(finding)
            if action_col.button("Remove", key=f"remove-dashboard-{original_index}"):
                st.session_state["findings"].pop(original_index)
                st.rerun()


def render_add_finding(defects: list[dict[str, Any]]) -> None:
    st.markdown("<div class='ib-kicker'>Add Finding</div>", unsafe_allow_html=True)
    st.markdown("<h1 class='ib-title'>Defect Library</h1>", unsafe_allow_html=True)
    st.markdown("<div class='ib-muted'>Pick a template to pre-fill the finding, then refine it for the property.</div>", unsafe_allow_html=True)

    library_col, form_col = st.columns([1.1, 1], gap="large")
    with library_col:
        search = st.text_input("Search 1,200+ standardized defects", placeholder="Try: roof, GFCI, leak, smoke...")
        selected_category = st.selectbox("Filter category", ["All", *SECTIONS], index=0)
        filtered_defects = [
            defect
            for defect in defects
            if (selected_category == "All" or defect["category"] == selected_category)
            and (
                not search
                or search.lower()
                in " ".join([defect["category"], defect["title"], defect["observation"], defect["recommendation"]]).lower()
            )
        ]
        st.caption(f"{len(filtered_defects)} defect templates")
        for defect in filtered_defects:
            with st.container(border=True):
                st.markdown(
                    f"""
                    {severity_badge(defect["severity"])}
                    <div class="ib-finding-title">{h(defect["title"])}</div>
                    <div class="ib-muted" style="font-size:.8rem;">{h(defect["category"])}</div>
                    <p class="ib-finding-body">{h(defect["observation"])}</p>
                    """,
                    unsafe_allow_html=True,
                )
                if st.button("Use this defect", key=f"use-{defect['id']}"):
                    st.session_state["category"] = defect["category"]
                    st.session_state["severity"] = defect["severity"]
                    st.session_state["title"] = defect["title"]
                    st.session_state["location"] = ""
                    st.session_state["observation"] = defect["observation"]
                    st.session_state["recommendation"] = defect["recommendation"]
                    st.session_state["notes"] = ""
                    st.rerun()

    with form_col:
        st.markdown("### Finding Editor")
        st.image(asset_for_category(st.session_state["category"]), use_container_width=True)
        with st.form("finding_form", clear_on_submit=False):
            category = st.selectbox("Category", SECTIONS, key="category")
            severity = st.selectbox("Severity", SEVERITIES, key="severity")
            title = st.text_input("Defect title", key="title")
            location = st.text_input("Location", placeholder="e.g. Roof - South slope", key="location")
            observation = st.text_area("Observation", key="observation", height=120)
            recommendation = st.text_area("Recommendation", key="recommendation", height=105)
            notes = st.text_area("Notes optional", key="notes", height=80)
            photos = st.file_uploader(
                "Photos optional",
                type=["png", "jpg", "jpeg"],
                accept_multiple_files=True,
                key="finding_photos",
            )

            submitted = st.form_submit_button("Save Finding", type="primary", use_container_width=True)
            if submitted:
                if not title or not observation or not recommendation:
                    st.error("Title, observation, and recommendation are required.")
                else:
                    add_finding_from_form(photos, category, severity, title, location, observation, recommendation, notes)
                    st.success("Finding added.")
                    st.rerun()


def render_summary(property_address: str, inspector_name: str, company_name: str) -> None:
    findings = st.session_state["findings"]
    counts = severity_counts(findings)
    priority = [finding for severity in SEVERITIES for finding in findings if finding.get("severity") == severity]

    st.markdown("<div class='ib-kicker'>Executive Summary</div>", unsafe_allow_html=True)
    st.markdown("<h1 class='ib-title'>Summary of Inspection Findings</h1>", unsafe_allow_html=True)
    st.markdown(
        f"<p class='ib-muted'>This summary highlights the most significant items discovered during the inspection of {h(property_address)}. It should be read together with the detailed findings and photographs.</p>",
        unsafe_allow_html=True,
    )

    cards = st.columns(4)
    for col, severity in zip(cards, SEVERITIES):
        meta = UI_SEVERITY[severity]
        col.markdown(
            f"""
            <div class="ib-card">
              <div style="font-size:2rem;font-weight:850;color:{meta['hex']};">{counts[severity]}</div>
              <strong>{meta['short']}</strong>
              <div class="ib-muted" style="font-size:.78rem;margin-top:.2rem;">{severity} findings</div>
            </div>
            """,
            unsafe_allow_html=True,
        )

    st.markdown("### Priority Findings")
    if not priority:
        st.info("No findings have been added yet.")
    for index, finding in enumerate(priority, start=1):
        with st.container(border=True):
            st.markdown(
                f"""
                <div style="display:flex;gap:1rem;">
                  <div style="width:2rem;height:2rem;border-radius:999px;background:rgba(255,255,255,.08);display:grid;place-items:center;font-weight:800;">{index}</div>
                  <div>
                    {severity_badge(finding.get("severity", "Informational"))}
                    <span class="ib-muted" style="font-size:.8rem;margin-left:.5rem;">{h(finding.get("location", "Unspecified location"))}</span>
                    <div class="ib-finding-title">{h(finding.get("title"))}</div>
                    <p class="ib-finding-body">{h(finding.get("recommendation"))}</p>
                  </div>
                </div>
                """,
                unsafe_allow_html=True,
            )

    st.markdown(
        f"""
        <div class="ib-card" style="margin-top:1.5rem;">
          <p class="ib-finding-body"><strong style="color:#f6f8fb;">Inspector's note:</strong> Major and moderate items warrant prompt attention by qualified professionals. Minor and informational items should be used for routine maintenance planning.</p>
          <div style="border-top:1px solid rgba(255,255,255,.09);margin-top:1rem;padding-top:1rem;">
            <strong>{h(inspector_name)}</strong><br><span class="ib-muted">{h(company_name)}</span>
          </div>
        </div>
        """,
        unsafe_allow_html=True,
    )


def render_pdf_preview(client_name: str, property_address: str, inspection_date: date, inspector_name: str, company_name: str) -> None:
    findings = st.session_state["findings"]
    counts = severity_counts(findings)

    st.markdown("<div class='ib-kicker'>PDF Preview</div>", unsafe_allow_html=True)
    st.markdown("<h1 class='ib-title'>Report Pages</h1>", unsafe_allow_html=True)
    st.markdown("<div class='ib-muted'>Visual approximation of the generated report structure.</div>", unsafe_allow_html=True)

    st.markdown(
        f"""
        <div class="ib-paper">
          <div class="ib-paper-cover">
            <div style="font-size:.78rem;text-transform:uppercase;letter-spacing:.18em;opacity:.82;">Home Inspection Report</div>
            <div style="font-size:1.8rem;font-weight:900;line-height:1.1;margin-top:.5rem;">{h(property_address)}</div>
            <div style="opacity:.85;margin-top:.25rem;">Prepared by {h(company_name)}</div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;">
            <div><div class="ib-paper-muted">Prepared For</div><strong>{h(client_name)}</strong></div>
            <div><div class="ib-paper-muted">Inspection Date</div><strong>{h(inspection_date.strftime("%B %d, %Y"))}</strong></div>
            <div><div class="ib-paper-muted">Inspector</div><strong>{h(inspector_name)}</strong></div>
            <div><div class="ib-paper-muted">Findings</div><strong>{len(findings)}</strong></div>
          </div>
        </div>
        """,
        unsafe_allow_html=True,
    )

    summary_rows = "".join(
        f"<div style='border:1px solid #edf0f4;border-radius:10px;padding:.8rem;text-align:center;'><div style='font-size:1.6rem;font-weight:900;color:{UI_SEVERITY[s]['hex']};'>{counts[s]}</div><div class='ib-paper-muted'>{UI_SEVERITY[s]['short']}</div></div>"
        for s in SEVERITIES
    )
    finding_rows = "".join(
        f"<div style='display:flex;align-items:center;gap:.75rem;border-top:1px solid #eef1f5;padding:.7rem 0;'>{severity_badge(finding.get('severity', 'Informational'))}<strong style='flex:1;'>{h(finding.get('title'))}</strong><span class='ib-paper-muted'>{h(finding.get('category'))}</span></div>"
        for finding in findings
    ) or "<div class='ib-paper-muted'>No findings documented yet.</div>"
    st.markdown(
        f"""
        <div class="ib-paper">
          <div style="display:flex;justify-content:space-between;border-bottom:1px solid #e7eaef;padding-bottom:.8rem;">
            <strong>Summary of Findings</strong><span class="ib-paper-muted">Page 2</span>
          </div>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:.75rem;margin:1rem 0;">{summary_rows}</div>
          {finding_rows}
        </div>
        """,
        unsafe_allow_html=True,
    )

    for index, finding in enumerate(findings[:3], start=3):
        st.markdown(
            f"""
            <div class="ib-paper">
              <div style="display:flex;justify-content:space-between;border-bottom:1px solid #e7eaef;padding-bottom:.8rem;">
                <strong>Detailed Finding</strong><span class="ib-paper-muted">Page {index}</span>
              </div>
              <div style="margin-top:1rem;">{severity_badge(finding.get("severity", "Informational"))}</div>
              <h3 style="margin-bottom:.2rem;">{h(finding.get("title"))}</h3>
              <div class="ib-paper-muted">{h(finding.get("category"))} - {h(finding.get("location", "Unspecified location"))}</div>
              <div style="margin-top:1rem;"><strong>Observation</strong><p>{h(finding.get("observation"))}</p></div>
              <div style="background:#f5f8fc;border-radius:10px;padding:1rem;margin-top:1rem;"><strong>Recommendation</strong><p>{h(finding.get("recommendation"))}</p></div>
            </div>
            """,
            unsafe_allow_html=True,
        )


def main() -> None:
    st.set_page_config(page_title="InspectionBuilder", layout="wide", page_icon="IB")
    ensure_directories()
    initialize_state()
    inject_css()

    with st.sidebar:
        client_name = st.text_input("Client name", value="John Smith")
        property_address = st.text_area("Property address", value="123 Main St, Austin, TX")
        inspection_date = st.date_input("Inspection date", value=date.today())
        inspector_name = st.text_input("Inspector name", value="Alex Inspector")
        company_name = st.text_input("Company name", value="Example Home Inspections")
        company_logo = st.file_uploader("Company logo optional", type=["png", "jpg", "jpeg"])
        cover_photo = st.file_uploader("Cover photo optional", type=["png", "jpg", "jpeg"])
        limitations = st.text_area(
            "Limitations",
            value="This report is based on a limited visual inspection of readily accessible areas.",
        )
        render_sidebar_summary(client_name, property_address, inspection_date, inspector_name, company_name, cover_photo)

    report_meta = {
        "client_name": client_name,
        "property_address": property_address,
        "inspection_date": inspection_date.isoformat(),
        "inspector_name": inspector_name,
        "company_name": company_name,
        "limitations": limitations,
    }
    generate_disabled = not client_name or not property_address or not inspector_name or not company_name

    header_left, header_right = st.columns([0.72, 0.28], vertical_alignment="center")
    header_left.markdown("<div class='ib-kicker'>Modern Premium SaaS</div><h1 class='ib-title'>InspectionBuilder</h1>", unsafe_allow_html=True)
    if header_right.button("Generate PDF", type="primary", disabled=generate_disabled, use_container_width=True):
        persist_and_generate_report(report_meta.copy(), st.session_state["findings"], company_logo, cover_photo)
    render_generate_result()

    defects = load_defect_library()
    dashboard_tab, add_tab, summary_tab, pdf_tab = st.tabs(["Dashboard", "Add Finding", "Summary", "PDF Preview"])
    with dashboard_tab:
        render_dashboard(property_address)
    with add_tab:
        render_add_finding(defects)
    with summary_tab:
        render_summary(property_address, inspector_name, company_name)
    with pdf_tab:
        render_pdf_preview(client_name, property_address, inspection_date, inspector_name, company_name)
        st.divider()
        if st.button("Save report and generate PDF", type="primary", disabled=generate_disabled):
            persist_and_generate_report(report_meta.copy(), st.session_state["findings"], company_logo, cover_photo)
        render_generate_result()


if __name__ == "__main__":
    main()
