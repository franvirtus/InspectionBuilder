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
    "Major": colors.HexColor("#b91c1c"),
    "Moderate": colors.HexColor("#c2410c"),
    "Minor": colors.HexColor("#ca8a04"),
    "Informational": colors.HexColor("#2563eb"),
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
            rows = [["Category", "Finding"]]
            rows.extend([[pdf_text(item["category"]), pdf_text(item["title"])] for item in severity_findings])
            table = Table(rows, colWidths=[1.5 * inch, 4.7 * inch])
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
    st.session_state.setdefault("observation", "")
    st.session_state.setdefault("recommendation", "")
    st.session_state.setdefault("notes", "")


def main() -> None:
    st.set_page_config(page_title="InspectionBuilder", layout="wide")
    ensure_directories()
    initialize_state()

    st.title("InspectionBuilder")
    st.caption("Professional inspection reports in minutes. No bloated software. No monthly fee.")

    with st.sidebar:
        st.header("Report Details")
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

    defects = load_defect_library()

    st.subheader("Defect Library")
    search = st.text_input("Search demo defects", placeholder="Try: roof, GFCI, leak, smoke...")
    filtered_defects = [
        defect
        for defect in defects
        if not search
        or search.lower()
        in " ".join([defect["category"], defect["title"], defect["observation"], defect["recommendation"]]).lower()
    ]

    library_col, form_col = st.columns([1, 1.4], gap="large")

    with library_col:
        st.write(f"{len(filtered_defects)} defect templates")
        for defect in filtered_defects:
            with st.container(border=True):
                st.markdown(f"**{defect['title']}**")
                st.caption(f"{defect['category']} | {defect['severity']}")
                if st.button("Use this defect", key=f"use-{defect['id']}"):
                    st.session_state["category"] = defect["category"]
                    st.session_state["severity"] = defect["severity"]
                    st.session_state["title"] = defect["title"]
                    st.session_state["observation"] = defect["observation"]
                    st.session_state["recommendation"] = defect["recommendation"]
                    st.session_state["notes"] = ""
                    st.rerun()

    with form_col:
        st.subheader("Add Finding")
        with st.form("finding_form", clear_on_submit=False):
            category = st.selectbox("Category", SECTIONS, key="category")
            severity = st.selectbox("Severity", SEVERITIES, key="severity")
            title = st.text_input("Defect title", key="title")
            observation = st.text_area("Observation", key="observation", height=110)
            recommendation = st.text_area("Recommendation", key="recommendation", height=110)
            photos = st.file_uploader(
                "Photos optional",
                type=["png", "jpg", "jpeg"],
                accept_multiple_files=True,
                key="finding_photos",
            )
            notes = st.text_area("Notes optional", key="notes")

            submitted = st.form_submit_button("Add finding")
            if submitted:
                if not title or not observation or not recommendation:
                    st.error("Title, observation, and recommendation are required.")
                else:
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
                            "observation": observation,
                            "recommendation": recommendation,
                            "notes": notes,
                            "temp_photo_paths": temp_photo_paths,
                        }
                    )
                    st.success("Finding added.")
                    st.rerun()

    st.subheader("Current Findings")
    if st.session_state["findings"]:
        for index, finding in enumerate(st.session_state["findings"], start=1):
            with st.container(border=True):
                st.markdown(f"**{index}. {finding['category']} - {finding['title']}**")
                st.caption(finding["severity"])
                st.write(finding["observation"])
                if st.button("Remove", key=f"remove-{index}"):
                    st.session_state["findings"].pop(index - 1)
                    st.rerun()
    else:
        st.info("No findings added yet.")

    st.divider()
    generate_disabled = not client_name or not property_address or not inspector_name or not company_name
    if st.button("Save report and generate PDF", type="primary", disabled=generate_disabled):
        report_meta = {
            "client_name": client_name,
            "property_address": property_address,
            "inspection_date": inspection_date.isoformat(),
            "inspector_name": inspector_name,
            "company_name": company_name,
            "limitations": limitations,
        }
        payload = build_report_payload(report_meta, st.session_state["findings"])
        report_id = payload["id"]

        report_meta["company_logo_path"] = save_uploaded_file(company_logo, report_id, "logo")
        report_meta["cover_photo_path"] = save_uploaded_file(cover_photo, report_id, "cover")

        persisted_findings = []
        for finding_index, finding in enumerate(st.session_state["findings"], start=1):
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

        st.success("Report saved and PDF generated.")
        st.write(f"JSON: `{json_path}`")
        st.write(f"PDF: `{pdf_path}`")
        with pdf_path.open("rb") as pdf_file:
            st.download_button("Download PDF", pdf_file, file_name=pdf_path.name, mime="application/pdf")


if __name__ == "__main__":
    main()
