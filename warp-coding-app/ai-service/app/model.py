from transformers import AutoModelForCausalLM, AutoTokenizer
import torch


def load_model(model_name: str = "gpt2"):
    """Load tokenizer and model, move model to available device and set sensible defaults.

    Returns a dict with keys: "model", "tokenizer", "device".
    """
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    tokenizer = AutoTokenizer.from_pretrained(model_name)
    # Ensure a pad token exists (gpt2 does not define one by default)
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token

    model = AutoModelForCausalLM.from_pretrained(model_name)
    model.to(device)
    model.eval()

    return {"model": model, "tokenizer": tokenizer, "device": device}


def generate_text(model_bundle, prompt: str, max_length: int = 150) -> str:
    """Generate text from a prompt using the provided model bundle.

    - Moves inputs to the model device
    - Uses no_grad() to avoid storing gradients
    - Sets pad_token_id to eos_token_id to avoid warnings
    """
    if not prompt:
        return ""

    tokenizer = model_bundle["tokenizer"]
    model = model_bundle["model"]
    device = model_bundle.get("device", torch.device("cpu"))

    inputs = tokenizer(prompt, return_tensors="pt")
    # move tensors to the same device as the model
    inputs = {k: v.to(device) for k, v in inputs.items()}

    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_length=max_length,
            do_sample=True,
            top_k=50,
            top_p=0.95,
            temperature=0.7,
            pad_token_id=tokenizer.eos_token_id,
        )

    return tokenizer.decode(outputs[0], skip_special_tokens=True).strip()
