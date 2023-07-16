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
            message_logs : [],
            current_model : "luna"
        }));
    }

    
    let JSON_DATA = JSON.parse(fs.readFileSync(message_dir).toString());

    if(JSON_DATA.current_model == undefined) JSON_DATA.current_model = "luna"

    let base_dir = message_dir.replace(`/message_logs/${message.author.id}.json`, "") + "/characters";

    JSON_DATA.message_logs.push("User: " + message.toString());

    let context = fs.readFileSync(`${base_dir}/${JSON_DATA.current_model}/context.txt`).toString().replaceAll("\r", "").split("\n");

    let instructions = fs.readFileSync(`${base_dir}/${JSON_DATA.current_model}/instructions.txt`).toString().replaceAll("\r", "");
    let knowledge = fs.readFileSync(`${base_dir}/${JSON_DATA.current_model}/knowledge.txt`).toString().replaceAll("\r", "");


    let dialogue = context.concat(JSON_DATA.message_logs);
    let text_dialogue = dialogue.join(" EOS ");
    let data;
    try {
        data = await axios.get(LUNA.ngrok_link + `/chat?prompt=${dialogue}&knowledge=${knowledge}&instruction=${instructions}`);
    } catch(err) {
        message.reply("There was an error!");
        console.error(err);
        return;
    }

    JSON_DATA.message_logs.push("Luna:" + data.data);

    fs.writeFileSync(message_dir, JSON.stringify(JSON_DATA, null, 2));

    return message.reply(data.data);
}