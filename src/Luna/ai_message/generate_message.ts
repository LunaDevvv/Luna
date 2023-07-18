import axios from "axios";
import LUNA from "../..";
import fs from "fs";
import { Message } from "discord.js";

//! DEFAULT CREATION IS GODEL.
// ONCE OTHERS ARE IMPLEMENTED ILL ADD THOSE.

export default async function generate(message : Message<boolean>) {
    if(message.author.bot) return;

    if(message.channelId !== LUNA.channel_id) {
        if(message.author.id !== LUNA.dev_id) return message.reply("This is not available to the public!");
    }
    
    
    if(!LUNA.ngrok_link) return;
    
    let message_dir : string = `${__dirname.replaceAll("\\", "/").replace("/dist/Luna/ai_message", "")}/message_logs/${message.author.id}.json`
    if(!fs.existsSync(message_dir)){
        fs.writeFileSync(message_dir, JSON.stringify({
            message_logs : {},
            current_character : "luna",
            top_p : 0.3,
            tempurature: 0.5,
            current_model: LUNA.base_model
        }));
    }
    
    let JSON_DATA = JSON.parse(fs.readFileSync(message_dir).toString());

    if(!JSON_DATA.current_model) JSON_DATA.current_model = LUNA.base_model;

    if(JSON_DATA.current_character == undefined) JSON_DATA.current_character = "luna"
    if(JSON_DATA.top_p == undefined) JSON_DATA.top_p = 0.3;
    if(JSON_DATA.tempurature == undefined) JSON_DATA.tempurature = 0.5;


    if(!JSON_DATA.current_model || !LUNA.text_gen_models?.includes(JSON_DATA.current_model)) return message.reply("That model is no currently loaded!");

    const character_info_dir = `${__dirname.replaceAll("\\", "/").replace("/dist/Luna/ai_message", "")}/characters/${JSON_DATA.current_character}/${JSON_DATA.current_model.split("/")[1]}`;

    if(!fs.existsSync(character_info_dir + "/model_data.json")) return message.reply("The character isn't correctly set up for that model!");

    const { EOS_TOKEN, bot_tag, user_tag } = JSON.parse(fs.readFileSync(character_info_dir + "/model_data.json").toString());

    if(!EOS_TOKEN) return message.reply("Model incorrectly setup for that character!");

    let user_prompt = message.toString();
    if(user_tag) user_tag + ": " + user_prompt;

    //? Make sure the message logs exist for the character, and the model being used.
    if(!JSON_DATA.message_logs) JSON_DATA.message_logs = {};
    if(!JSON_DATA.message_logs[JSON_DATA.current_character]) JSON_DATA.message_logs[JSON_DATA.current_character] = {};
    if(!JSON_DATA.message_logs[JSON_DATA.current_character][JSON_DATA.current_model]) JSON_DATA.message_logs[JSON_DATA.current_character][JSON_DATA.current_model] = {message_logs : []}

    JSON_DATA.message_logs[JSON_DATA.current_character][JSON_DATA.current_model].message_logs.push(user_prompt);

    
    let context: Array<string> = [];
    let knowledge = "";
    let instructions = "";
    
    try {
        context = fs.readFileSync(character_info_dir + "/context.txt").toString().split("\n");
    } catch(err) {}
    
    try {
        knowledge = fs.readFileSync(character_info_dir + "/knowledge.txt").toString();
    } catch(err) {}
    
    try {
        instructions = fs.readFileSync(character_info_dir + "/instructions.txt").toString();
    } catch(err) {}
    
    let dialogue = context.concat(JSON_DATA.message_logs[JSON_DATA.current_character][JSON_DATA.current_model].message_logs.join(EOS_TOKEN));


    let prompt = `${instructions} ${dialogue} ${knowledge}`;

    try {
        let { data } = await axios.get(`${LUNA.ngrok_link}/chat?prompt=${prompt}&model=${JSON_DATA.current_model}&top_p=${JSON_DATA.top_p}&tempurature=${JSON_DATA.tempurature}`)
        if(data == "Failed to find model!") throw new Error("There was an error finding the requested module");

        let save_data = data;

        if(bot_tag) `${save_data}: ${data}`; 

        JSON_DATA.message_logs[JSON_DATA.current_character][JSON_DATA.current_model].message_logs.push(save_data);

        message.reply(data);

        return fs.writeFileSync(message_dir, JSON.stringify(JSON_DATA));
    } catch(err) {
        console.error(err);
        message.reply("There was an error!");
    }

}