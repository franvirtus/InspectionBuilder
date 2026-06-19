---
name: inspectionbuilder-ui-polish
description: Improve InspectionBuilder Streamlit UI/UX with premium SaaS design while preserving backend, PDF, JSON, translations, and project structure.
---

# InspectionBuilder UI Polish Skill

Use this skill whenever the task involves improving InspectionBuilder's frontend, Streamlit interface, layout, visual hierarchy, forms, sidebar, dashboard, tabs, cards, buttons, responsiveness, or premium SaaS appearance.

## Project context

InspectionBuilder is a Streamlit application.

Main file:
- app.py

Stack:
- Streamlit
- ReportLab
- Pillow
- Jinja2
- local JSON persistence
- custom CSS injected through st.markdown
- bilingual Italian/English labels through TRANSLATIONS

The app is not React, not Next.js, not Tailwind, and has no frontend build pipeline.

## Hard rules

Do not change:
- PDF generation logic unless explicitly requested
- ReportLab document structure unless explicitly requested
- JSON persistence structure
- data folder structure
- exports folder structure
- assets folder structure
- requirements.txt unless explicitly requested
- TRANSLATIONS architecture
- existing bilingual Italian/English support

Do not introduce:
- React
- Tailwind
- Bootstrap
- external CSS frameworks
- JavaScript build tools
- new databases
- cloud storage
- authentication
- unnecessary dependencies

## Visual direction

The target design is:
- dark premium SaaS
- professional inspection/reporting workspace
- clean and credible
- not playful
- not childish
- not generic Streamlit default
- high contrast but not harsh
- reduced clicks
- consistent buttons
- consistent spacing
- readable forms
- clear dashboard hierarchy
- useful sidebar
- polished PDF preview
- good empty states
- tablet-friendly where Streamlit allows it

## Preferred improvements

Prioritize:
1. visual consistency
2. spacing and alignment
3. sidebar consistency between local and deployed version
4. button hierarchy
5. form usability
6. dashboard cards
7. findings list readability
8. defect library cards
9. summary cards
10. PDF preview polish
11. responsive behavior
12. reduced visual noise

## Code rules

Before editing:
- inspect app.py
- identify current helper functions
- identify current CSS variables
- identify current button helpers
- identify current render_* functions
- explain the UI problems found

When editing:
- prefer surgical changes
- reuse existing helpers
- keep CSS centralized in inject_css when possible
- do not duplicate button logic
- preserve existing function names unless refactoring is clearly useful
- preserve session_state keys
- preserve translations
- preserve PDF generation behavior

After editing:
- run:
  python -m py_compile app.py
- show files changed
- explain what changed
- explain what was intentionally not touched
- show git diff summary

## InspectionBuilder-specific known focus

Pay special attention to:
- local/deployed sidebar inconsistency
- Streamlit sidebar rendering
- layout="wide"
- st.sidebar usage
- CSS selectors that may behave differently online
- tabs layout
- mobile/tablet behavior
- container borders
- upload widgets
- selectbox/input contrast
- primary/secondary/danger button styling
- dashboard metric hierarchy
- add finding workflow
- PDF preview visual consistency
