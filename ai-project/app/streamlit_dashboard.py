import streamlit as st
import requests

st.set_page_config(page_title="Aether‑Khem Matrix", layout="wide")

st.markdown("""
<style>
body { background-color: #0A0A0A; color: #D4AF37; }
</style>
""", unsafe_allow_html=True)

st.title("𓂀 Aether‑Khem Matrix Dashboard")

msg = st.text_area("Enter your command:", height=150)

if st.button("Send"):
    try:
        r = requests.post("http://localhost:8000/matrix", json={"message": msg}, timeout=10)
        r.raise_for_status()
        data = r.json()

        st.subheader(f"Agent: {data.get('agent')}")
        st.write(data.get("output"))

        st.subheader("Memory Hits")
        st.write(data.get("memory_hits"))
    except Exception as e:
        st.error(f"Request failed: {e}")
