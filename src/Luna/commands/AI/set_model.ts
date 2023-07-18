import { EmbedBuilder } from "@discordjs/builders";
import { CommandOptionType, command } from "../../luna";
import fs from "fs";

const AI_command : command = {
    interaction : {
        name : "choose_model",
        description : "Chooses a model",
        options : [{
            name : "model",
            description : "The model to choose",
            type : CommandOptionType.STRING,
            required : true,
            choices: [{
                name: "vicuna-7b",
                value: "lmsys/vicuna-7b-v1.3"
            },{
                name: "vicuna-13b",
                value: "lmsys/vicuna-13b-v1.3"
            },{
                name: "vicuna-33b",
                value: "lmsys/vicuna-33b-v1.3"
            },{
                name: "vicuna-7b",
                value: "lmsys/vicuna-7b-v1.3"
            }, {
                name: "godel-small",
                value: "microsoft/GODEL-v1_1-base-seq2seq"
            }, {
                name: "godel-large",
                value: "microsoft/GODEL-v1_1-large-seq2seq"
            }, {
                name: "dialogpt-small",
                value: "microsoft/DialoGPT-small"
            }, {
                name: "dialogpt-medium",
                value: "microsoft/DialoGPT-medium"
            }, {
                name: "dialogpt-large",
                value: "microsoft/DialoGPT-small"
            }]
        }]
    },
    message : {
        name : "choose_model",
        description : "Chooses the model to generate with",
        options : ["model"]
    },
    async runInteraction(luna, interaction) {
        const model = interaction.options.get("model", true);

        if(!model) return interaction.followUp("Failed to get model!");
        if(typeof model != "string") return interaction.followUp("Somehow you put a non-string into a string field");

        let message_dir : string = `${__dirname.replaceAll("\\", "/").replace("/dist/Luna/commands/AI", "")}/message_logs/${interaction.user.id}.json`;
        let userJSON = JSON.parse(fs.readFileSync(message_dir).toString());

        if(!userJSON) 

        if(luna.text_gen_models?.includes(model)) {
            if(!userJSON.model) {
                
            }
        }
    },

    async runMessage(luna, message, args) {
        return message.reply("Not made for messages");    
    }
} 

export default AI_command;