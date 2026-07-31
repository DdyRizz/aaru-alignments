from fastapi import FastAPI
from app.model import load_model, generate_text
from app.schemas import PromptRequest, PromptResponse

app = FastAPI()
model = load_model()

@app.post("/generate", response_model=PromptResponse)
def generate(req: PromptRequest):
    output = generate_text(model, req.prompt)
    return PromptResponse(output=output)
