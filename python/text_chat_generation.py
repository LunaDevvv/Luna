# Run options :
# vicuna-7b
# vicuna-13b
# vicuna-30b
# GODEL-small
# GODEL-large
# DialoGPT-small
# DialoGPT-medium
# DialoGPT-large

import sys

model_names = []

for i in range(len(sys.argv)):
    if sys.argv[i] == "--model":
        model_names.append(sys.argv[i + 1])

checkpoints = []

for i in range(len(model_names)):
    match model_names[i]:
        case "vicuna-7b":
            checkpoints.append("lmsys/vicuna-7b-v1.3")
        case "vicuna-13b":
            checkpoints.append("lmsys/vicuna-13b-v1.3")
        case "vicuna-33b": 
            checkpoints.append("lmsys/vicuna-33b-v1.3")
        case "godel-small":
            checkpoints.append("microsoft/GODEL-v1_1-base-seq2seq")
        case "godel-large":
            checkpoints.append("microsoft/GODEL-v1_1-large-seq2seq")
        case "dialogpt-small":
            checkpoints.append("microsoft/DialoGPT-small")
        case "dialogpt-medium":
            checkpoints.append("microsoft/DialoGPT-medium")
        case "dialogpt-large":
            checkpoints.append("microsoft/DialoGPT-large")
        case _: 
            print(f"Unknown model : {model_names[i]}, skipping...")
