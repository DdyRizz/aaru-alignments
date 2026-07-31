import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

app = FastAPI(title="Aether‑Khem Unified Multi‑Agent System")

# -----------------------------
# Load Shared Model
# -----------------------------
MODEL_NAME = "gpt2"
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForCausalLM.from_pretrained(MODEL_NAME)

def run_model(prompt: str):
    inputs = tokenizer(prompt, return_tensors="pt")
    outputs = model.generate(**inputs, max_length=200)
    return tokenizer.decode(outputs[0], skip_special_tokens=True)

# -----------------------------
# Agent Definitions (Wired)
# -----------------------------
class Query(BaseModel):
    message: str

def agent_oracle(msg):
    return run_model(f"[ORACLE] Provide deep metaphysical insight:\n{msg}\nInsight:")

def agent_builder(msg):
    return run_model(f"[BUILDER] Generate runnable code:\n{msg}\nCode:")

def agent_guardian(msg):
    return run_model(f"[GUARDIAN] Evaluate correctness & safety:\n{msg}\nAssessment:")

def agent_router(msg):
    msg_lower = msg.lower()

    if any(k in msg_lower for k in ["code", "build", "function", "script"]):
        return "builder", agent_builder(msg)

    if any(k in msg_lower for k in ["why", "explain", "meaning", "understand"]):
        return "oracle", agent_oracle(msg)

    return "guardian", agent_guardian(msg)

# -----------------------------
# API Endpoint (Unified)
# -----------------------------
@app.post("/matrix")
def matrix_endpoint(query: Query):
    agent_name, response = agent_router(query.message)
    return {
        "agent": agent_name,
        "input": query.message,
        "output": response
    }

# -----------------------------
# Run Server
# -----------------------------
if __name__ == "__main__":
    uvicorn.run("aether_khem_matrix:app", host="0.0.0.0", port=8000, reload=True)
