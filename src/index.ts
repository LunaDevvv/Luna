import { ActivityType, Partials, PresenceData } from "discord.js";
import Luna from "./Luna/luna";
import dotenv from "dotenv";

dotenv.config();
const LUNA_TOKEN = process.env.LUNA_TOKEN;
const DEV_ID = process.env.DEV_ID;
const CHANNEL_ID = process.env.CHANNEL_ID;

if(!LUNA_TOKEN) throw new Error("Missing token");

let presence : PresenceData = {
    status : "dnd",
    activities: [{
        name: "for messages!",
        type: ActivityType.Watching
    }]
}

const LUNA = new Luna(LUNA_TOKEN, ["Guilds", "GuildMembers", "GuildMessages", "GuildEmojisAndStickers", "DirectMessages", "MessageContent"], {
    partials: [Partials.Message, Partials.Channel],
    presence: presence,
    dev_id: DEV_ID,
    chatbot_channel_id : CHANNEL_ID
});
export default LUNA;