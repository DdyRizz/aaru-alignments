import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForCausalLM
import faiss
import numpy as np
import json
import subprocess

# ---------------------------------------------------------
# Aether‑Khem Aesthetic
# ---------------------------------------------------------
AETHER_THEME = {
    "mode": "dark",
    "primary": "#D4AF37",
    "background": "#0A0A0A",
    "glyph": "𓂀"
}

app = FastAPI(
    title="Aether‑Khem Matrix",
    description=f"{AETHER_THEME['glyph']} Unified Multi‑Agent System",
)

# ---------------------------------------------------------
# Model
# ---------------------------------------------------------
MODEL_NAME = "gpt2"
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForCausalLM.from_pretrained(MODEL_NAME)

def llm(prompt: str):
    inputs = tokenizer(prompt, return_tensors="pt")
    outputs = model.generate(**inputs, max_length=200)
    return tokenizer.decode(outputs[0], skip_special_tokens=True)

# ---------------------------------------------------------
# Vector Search (FAISS)
# ---------------------------------------------------------
dim = 128
index = faiss.IndexFlatL2(dim)
memory_store = []

def embed(text: str):
    # NOTE: replace this with a real embedding model for production
    arr = np.random.rand(dim).astype("float32")
    return arr

def add_memory(text: str):
    vec = embed(text)
    index.add(np.array([vec]))
    memory_store.append(text)

def search_memory(query: str):
    if len(memory_store) == 0:
        return []
    vec = embed(query)
    D, I = index.search(np.array([vec]), min(3, len(memory_store)))
    return [memory_store[i] for i in I[0] if i < len(memory_store)]

# ---------------------------------------------------------
# Agents
# ---------------------------------------------------------
class Query(BaseModel):
    message: str

def agent_oracle(msg: str):
    return llm(f"{AETHER_THEME['glyph']} ORACLE:\n{msg}\nInsight:")

def agent_builder(msg: str):
    return llm(f"{AETHER_THEME['glyph']} BUILDER:\n{msg}\nCode:")

def agent_guardian(msg: str):
    return llm(f"{AETHER_THEME['glyph']} GUARDIAN:\n{msg}\nAssessment:")

def agent_tools(cmd: str):
    try:
        result = subprocess.check_output(cmd, shell=True, text=True)
        return f"Tool Output:\n{result}"
    except Exception as e:
        return f"Tool Error: {e}"

# ---------------------------------------------------------
# Router
# ---------------------------------------------------------
def route(msg: str):
    m = msg.lower()

    if "run:" in m:
        # strip the run: prefix and execute the rest as a shell command
        return "tools", agent_tools(msg.split("run:", 1)[1].strip())

    if any(k in m for k in ["code", "build", "function"]):
        return "builder", agent_builder(msg)

    if any(k in m for k in ["why", "explain", "meaning"]):
        return "oracle", agent_oracle(msg)

    return "guardian", agent_guardian(msg)

# ---------------------------------------------------------
# API
# ---------------------------------------------------------
@app.post("/matrix")
def matrix(q: Query):
    add_memory(q.message)
    agent, out = route(q.message)
    memories = search_memory(q.message)

    return {
        "theme": AETHER_THEME,
        "agent": agent,
        "input": q.message,
        "memory_hits": memories,
        "output": out
    }

# ---------------------------------------------------------
# Run
# ---------------------------------------------------------
if __name__ == "__main__":
    uvicorn.run("aether_khem_matrix_faiss:app", host="0.0.0.0", port=8000, reload=True)
