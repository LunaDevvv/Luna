# For people who are running it on their own computer.

# NEITHER OF THESE ARE DONE YET. I JUST DID THIS FIRST

## Chat Generation

## No chat generation requires GPU, its just recommended
Also going to try and get INTEL ARC support, since its my daily driver.

You probably could make this more efficient with accelerate, I might do that at some point.<br>

To choose a model use --model {model arg}

You can do multiple too, for example (Every model option needs the --model in front of it):<br> --model vicuna-7b --model dialogpt-small

Ram requirements are a random guess, other than the first two vicuna instances I am probably off.

### Vicuna
| model                                                                           | Ram requirement  | Disk Space | model arg  |
| --------------------------------------------------------------------------------| ---------------- | ---------- | ---------- |
| [lmsys/vicuna-7b-v1.3](https://huggingface.co/lmsys/vicuna-7b-v1.3)             | ~30gb            | ~14gb      | vicuna-7b  |
| [lmsys/vicuna-13b-v1.3](https://huggingface.co/lmsys/vicuna-13b-v1.3)           | ~60gb            | ~26gb      | vicuna-13b |
| [lmsys/vicuna-33b-v1.3](https://huggingface.co/lmsys/vicuna-33b-v1.3/tree/main) | ~120gb -> ~180gb | ~65gb      | vicuna-33b |

### Godel

| model                                                                                           | Ram requirement  | Disk Space | model arg   |
| ----------------------------------------------------------------------------------------------- | ---------------- | ---------- | ----------- |
| [microsoft/GODEL-v1_1-base-seq2seq](https://huggingface.co/microsoft/GODEL-v1_1-base-seq2seq)   | ~3gb             | ~1gb       | godel-small |
| [microsoft/GODEL-v1_1-large-seq2seq](https://huggingface.co/microsoft/GODEL-v1_1-large-seq2seq) | ~6gb             | ~3gb       | godel-large |

### DialoGPT

| model                                                               | Ram requirement  | Disk Space | model arg       |
| ------------------------------------------------------------------  | ---------------- | ---------- | -------------   |
| [dialogpt-small](https://huggingface.co/microsoft/DialoGPT-small)   | ~4gb             | ~1.7gb     | godel-small     |
| [dialogpt-medium](https://huggingface.co/microsoft/DialoGPT-medium) | ~10gb            | ~4.7gb     | dialogpt-medium |
| [dialogpt-large](https://huggingface.co/microsoft/DialoGPT-large)   | ~6gb             | ~8gb       | dialogpt-large  |


## Image generation
Not implemented yet