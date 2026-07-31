import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

app = FastAPI(title="Aether‑Khem Multi‑Agent System")

# -----------------------------
# Base Model Loader (shared)
# -----------------------------
MODEL_NAME = "gpt2"  # swap for any HF model you prefer
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForCausalLM.from_pretrained(MODEL_NAME)

def run_model(prompt: str):
    inputs = tokenizer(prompt, return_tensors="pt")
    outputs = model.generate(**inputs, max_length=200)
    return tokenizer.decode(outputs[0], skip_special_tokens=True)

# -----------------------------
# Agent Definitions
# -----------------------------
class Query(BaseModel):
    message: str

def agent_oracle(msg: str):
    return run_model(f"Oracle Agent — Provide deep insight:\n{msg}\nInsight:")

def agent_builder(msg: str):
    return run_model(f"Builder Agent — Generate actionable code:\n{msg}\nCode:")

def agent_guardian(msg: str):
    return run_model(f"Guardian Agent — Evaluate safety & correctness:\n{msg}\nAssessment:")

# -----------------------------
# Router Logic
# -----------------------------
def route_message(msg: str):
    msg_lower = msg.lower()

    if "code" in msg_lower or "build" in msg_lower:
        return "builder", agent_builder(msg)

    if "explain" in msg_lower or "why" in msg_lower:
        return "oracle", agent_oracle(msg)

    return "guardian", agent_guardian(msg)

# -----------------------------
# API Endpoint
# -----------------------------
@app.post("/agent")
def agent_endpoint(query: Query):
    agent_name, response = route_message(query.message)
    return {
        "agent": agent_name,
        "input": query.message,
        "output": response
    }

# -----------------------------
# Run Server
# -----------------------------
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
