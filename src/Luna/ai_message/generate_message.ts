import axios from "axios";
import LUNA from "../..";
import fs from "fs";
import { Message } from "discord.js";

export default async function generate(message : Message<boolean>) {
    if(message.author.bot) return;

    if(message.channelId !== LUNA.channel_id) {
        if(message.author.id !== LUNA.dev_id) return message.reply("This is not available to the public!");
    }
    
    let message_dir : string = `${__dirname.replaceAll("\\", "/").replace("/dist/Luna/ai_message", "")}/message_logs/${message.author.id}.json`

    if(!LUNA.ngrok_link) return;

    if(!fs.existsSync(message_dir)){
        fs.writeFileSync(message_dir, JSON.stringify({
            message_logs : []
        }));
    }

    
    let JSON_DATA = JSON.parse(fs.readFileSync(message_dir).toString());
    JSON_DATA.message_logs.push(message.toString());
    
    let dialogue = JSON_DATA.message_logs.join(" EOS ");

    let data;
    try {
        data = await axios.get(LUNA.ngrok_link + `/chat?dialogue=${dialogue}`);
    } catch(err) {
        message.reply("There was an error!");
        console.error(err);
        return;
    }

    JSON_DATA.message_logs.push(data.data);

    fs.writeFileSync(message_dir, JSON.stringify(JSON_DATA, null, 2));

    return message.reply(data.data);
}