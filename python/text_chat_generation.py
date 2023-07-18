import sys
import torch
from transformers import AutoModelForCausalLM, AutoModelForSeq2SeqLM, AutoTokenizer
from flask import Flask, request, Response
from flask_cors import CORS
import accelerate

checkpoints = []
cpu_only = False

class Model:
    model : any
    tokenizer : any
    in_use : any

    def __init__(self, model, tokenizer, model_name):
        self.model = model
        self.tokenizer = tokenizer
        self.model_name = model_name

for i in range(len(sys.argv)):
    if sys.argv[i] == "--model":
        checkpoints.append(sys.argv[i + 1])

    if sys.argv[i] == "--cpu":
        cpu_only = True

models = []

device = "cpu"

if torch.cuda.is_available() and cpu_only != True:
    device = "cuda"


for i in range(len(checkpoints)):
    model = None
    
    if "seq2seq" in checkpoints[i]:
        model = AutoModelForSeq2SeqLM.from_pretrained(checkpoints[i], device_map="auto")
    else:
        model = AutoModelForCausalLM.from_pretrained(checkpoints[i], device_map="auto")
    
    tokenizer = AutoTokenizer.from_pretrained(checkpoints[i])

    model = model.to(device)
    
    models.append(Model(model, tokenizer, checkpoints[i]))


app = Flask(__name__)
CORS(app)


# This requires pre-formatted prompts, and the checkpoint of the model you want to generate with
@app.route("/chat", methods=["GET"])
def chat():
    prompt = request.args.get("prompt")
    model = request.args.get("model")
    top_p = request.args.get("top_p")
    tempurature = request.args.get("tempurature")

    for i in range(len(models)):
        if models[i].model_name == model:
            input_ids = models[i].tokenizer(prompt, return_tensors="pt").to(device)

            outputs = models[i].model.generate(input_ids.input_ids, max_length=128, min_length=8, do_sample=True, top_p=float(top_p), temperature=float(tempurature))

            return tokenizer.decode(outputs[0], skip_special_tokens=True)

    return "Failed to find model!"

if __name__ == "__main__":
    app.run()