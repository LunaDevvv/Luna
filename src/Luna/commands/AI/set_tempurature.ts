import { CommandOptionType, command } from "../../luna";
import fs from "fs";


const temp_command : command = {
    interaction : {
        name : "set_temp",
        description : "Sets the temp field of a model. (Reduces repitition by reducing word choices)",
        options : [{
            name : "float",
            description : "The float number to use.",
            type : CommandOptionType.NUMBER,
            required : true,
            max_value: 1,
            min_value : 0
        }]
    },
    message : {
        name : "set_temp",
        description : "Sets the temp field of a model.",
        options : ["float"]
    },
    async runInteraction(luna, interaction) {
        const temp = interaction.options.get("float", true).value;

        if(typeof temp != "number") return interaction.followUp("Somehow, you managed to put a non-number value into a number field");

        let message_dir : string = `${__dirname.replaceAll("\\", "/").replace("/dist/Luna/commands/AI", "")}/message_logs/${interaction.user.id}.json`;

        let data : {
            temp? : number,
            [key : string] : any
        } | undefined;

        if(!fs.existsSync(message_dir)) {
            data = {
                temp : temp
            }
        } else {
            data = JSON.parse(fs.readFileSync(message_dir).toString());

            if(!data) data = {};
            data.temp = temp;
        }

        fs.writeFileSync(message_dir, JSON.stringify(data, null, 2));

        return interaction.followUp("Changed info!");
    },

    async runMessage(luna, message, args) {
        return message.reply("Not made for messages");    
    }
} 

export default temp_command;