# Streamlit UI Patterns

Use Streamlit-native layout where possible:
- st.columns
- st.container
- st.tabs
- st.sidebar
- st.form
- st.metric
- st.file_uploader
- st.download_button

Use custom HTML/CSS only for:
- cards
- badges
- visual hierarchy
- spacing
- typography
- controlled button styling
- preview blocks

Keep CSS inside inject_css unless creating a clearly justified helper.

Check Streamlit version compatibility before using newer parameters.

When fixing sidebar issues:
- verify st.set_page_config(layout="wide")
- verify all sidebar content is inside st.sidebar or with st.sidebar context
- check CSS hiding/collapsing sidebar
- check Streamlit Cloud viewport behavior
- check whether page config, CSS, or browser width explains the difference
