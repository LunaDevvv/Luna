import { CommandOptionType, command } from "../../luna";

const AI_command : command = {
    interaction : {
        name : "setup_link",
        description : "Sets up the API link",
        options : [{
            name : "link",
            description : "Sets up the api link for generating responses",
            type : CommandOptionType.STRING,
            required : true
        }]
    },
    message : {
        name : "setup_link",
        description : "Sets up the api link",
        options : ["link"]
    },
    async runInteraction(luna, interaction) {
        const link = interaction.options.get("link", true);

        if(interaction.user.id !== luna.dev_id) return interaction.followUp("You do not have permissions to do this!");
        if(!link) return interaction.followUp("I don't know how you did this, but you are missing the link option");

        luna.ngrok_link = link.value?.toString();

        return interaction.followUp({ content : "Updated link!", ephemeral : true } );
    },

    async runMessage(luna, message, args) {
        return message.reply("Not made for messages");    
    }
} 

export default AI_command;