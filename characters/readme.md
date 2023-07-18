# Sorry about how this is designed

## For each character, you need to make these things
A model_data.json, this is what it will look like

| Field     | Required? |
| --------- | --------- |
| EOS_TOKEN | Yes       |
| user_tag  | No        |
| bot_tag   | No        |

```json
{
    "EOS_TOKEN": "###",
    "user_tag": "USER",
    "bot_tag" : "ASSISTANT
}
```

context.txt, for if you want to start dialogues early with some built in context

instructions.txt, for any instructions

knowledge.txt, for any knowledge


### Prompt format
None of those files are required, just if you need them you have them. Here is how its put together

And yes, this is designed around GODEL

```
{instructions.txt} {(parsed)context.txt + user_dialogue} {knowledge.txt}
```

### I recommend trying to make your own character
My characters like acting up and not working, so i recommend trying to do this yourself too!

If you can get mine working feel free to let me know at puppynuff@gmail.com!