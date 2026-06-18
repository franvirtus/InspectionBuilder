# InspectionBuilder

Professional inspection reports in minutes. No bloated software. No monthly fee.

InspectionBuilder is a local-first MVP for home inspectors who need to create clean PDF inspection reports without cloud accounts, subscriptions, CRM features, or complex setup.

## MVP scope

- Local Streamlit app
- Basic report creation form
- Standard home inspection sections
- Searchable local defect library
- Click-to-fill demo defects
- Local JSON report save
- PDF export to `exports/`

## Project structure

```text
InspectionBuilder/
├── app.py
├── requirements.txt
├── README.md
├── data/
│   ├── defect_library_home.json
│   └── reports/
├── assets/
│   └── logo_placeholder.png
├── templates/
│   └── report_template.html
└── exports/
```

## Install

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

## Run

```bash
streamlit run app.py
```

## Notes

This first version is intentionally small. It does not include login, cloud sync, subscriptions, CRM, customer management, or database schema migrations. Reports are saved locally as JSON in `data/reports/`, and PDFs are exported locally in `exports/`.
