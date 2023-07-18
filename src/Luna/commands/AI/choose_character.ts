import { CommandOptionType, command } from "../../luna";
import fs from "fs";


const AI_command : command = {
    interaction : {
        name : "choose_character",
        description : "Chooses a character",
        options : [{
            name : "character",
            description : "The character to choose",
            type : CommandOptionType.STRING,
            required : true,
            choices: [{
                name : "Luna",
                value : "luna",
            }]
        }]
    },
    message : {
        name : "choose_character",
        description : "Chooses a character",
        options : ["character"]
    },
    async runInteraction(luna, interaction) {
        const character = interaction.options.get("character", true);

        if(typeof character != "string") return interaction.followUp("Somehow, you managed to put a non-string value into a string field");

        let message_dir : string = `${__dirname.replaceAll("\\", "/").replace("/dist/Luna/commands/AI", "")}/message_logs/${interaction.user.id}.json`;

        let data : {
            current_character? : string,
            [key : string] : any
        } | undefined;

        if(!fs.existsSync(message_dir)) {
            data = {
                current_character : character
            }
        } else {
            data = JSON.parse(fs.readFileSync(message_dir).toString());

            if(!data) data = {};
            data.current_character = character;
        }

        fs.writeFileSync(message_dir, JSON.stringify(data, null, 2));

        return interaction.followUp("Changed info!");
    },

    async runMessage(luna, message, args) {
        return message.reply("Not made for messages");    
    }
} 

export default AI_command;