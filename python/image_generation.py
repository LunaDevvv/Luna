import sys
import torch
from flask import Flask, request, Response
from flask_cors import CORS
from io import BytesIO
from diffusers import StableDiffusionPipeline
import base64

checkpoints = []
cpu_only = False

class Model:
    model : any

    def __init__(self, model, model_name):
        self.model = model
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


def dummy(images, **kwargs):
    return images, False

for i in range(len(checkpoints)):
    model = StableDiffusionPipeline.from_pretrained(checkpoints)


    model.to(device)

    models.push(Model(model, checkpoints[i]))


app = Flask(__name__)
CORS(app)

@app.route("/chat", methods=["GET"])
def chat():
    prompt = request.args.get("prompt")
    model = request.args.get("model")

    for i in range(len(models)):
        if models[i].model_name == model:
            image = models[i].model(prompt, guidance_scale=8.5).images[0]

            image.save("testimage.png")

            buffer=BytesIO()
            
            image.save(buffer, format="PNG")
            imgstr = base64.b64encode(buffer.getvalue())

            return imgstr
        
if __name__ == "__main__":
    app.run()