import { GatewayIntentsString, Client, Message, CommandInteraction, ActivityType, Partials, MessageMentionOptions, CacheFactory, PresenceData, ClientOptions, RESTOptions, SweepOptions, SweeperOptions, WebSocketOptions  } from "discord.js";
import { glob } from "glob";
import generate from "./ai_message/generate_message";

export default class Luna {
    client: Client;
    commands: Array<command>;
    commandNames: Array<string>;
    prefix: string = "l!";
    ngrok_link: string | undefined = undefined;
    dev_id?: string;
    channel_id? : string;
    
    constructor(token: string, intents: Array<GatewayIntentsString>, extra_data?: {
        partials?: Array<Partials>,
        allowedMentions?: MessageMentionOptions,
        closeTimeout?: number,
        failIfNotExists?: boolean,
        jsonTransformer?: ((obj: unknown) => unknown),
        makeCache?: CacheFactory,
        presence?: PresenceData,
        rest?: Partial<RESTOptions>,
        shardCount?: number,
        shards?: number | Array<number> | "auto",
        sweepers?: SweeperOptions,
        waitGuildTimeout?: number,
        ws?: WebSocketOptions,
        dev_id?: string,
        chatbot_channel_id?: string,
        text_gen_model?: Array<"vicuna-7b" | "vicuna-13b" | "vicuna-30b" | "godel-small" | "godel-large" | "dialogpt-small" | "dialogpt-medium" | "dialogpt-large">,
        image_gen_model?: "waifu-diffusion" | "everthingv3.0" | "both"
    }) {
        this.client = new Client({
            intents: intents,
            partials: extra_data?.partials,
            allowedMentions: extra_data?.allowedMentions,
            closeTimeout: extra_data?.closeTimeout,
            failIfNotExists: extra_data?.failIfNotExists,
            jsonTransformer: extra_data?.jsonTransformer,
            makeCache: extra_data?.makeCache,
            presence: extra_data?.presence,
            rest: extra_data?.rest,
            shardCount: extra_data?.shardCount,
            shards: extra_data?.shards,
            sweepers: extra_data?.sweepers,
            waitGuildTimeout: extra_data?.waitGuildTimeout,
            ws: extra_data?.ws
        });

        this.commands = [];
        this.commandNames = [];

        this.dev_id = extra_data?.dev_id;
        this.channel_id = extra_data?.chatbot_channel_id;

        this.#event_handler();

        this.client.login(token);
    }

    #event_handler() {
        this.client.on("ready", async () => {
            console.log(`Logged in as ${this.client.user?.tag}`);

            this.#registerCommands();
        });

        this.client.on("interactionCreate", async (interaction) => {
            if(!interaction.isCommand()) return;

            await interaction.deferReply({ ephemeral: false });

            for(let i = 0; i < this.commands.length; i++) {
                if(this.commands[i].interaction.name !== interaction.commandName) continue;
                
                try {
                    await this.commands[i].runInteraction(this, interaction);
                    return;
                } catch(err) {
                    console.error(err);

                    interaction.followUp({ ephemeral: true, content: "Error running command!" });
                    return;
                }
            }

            interaction.followUp({ ephemeral: true, content: "Couldn't find command!"});
            return;
        });

        this.client.on("messageCreate", async (message) => {
            let msg = message.toString();
            let args: Array<string> = msg.split(" ");

            if(message.channelId == this.channel_id) {
                await generate(message);
                return;
            }

            if(!message.guild) {
                await generate(message);
                return;
            }

            if(!msg.startsWith(this.prefix)) return;

            for(let i  = 0; i < this.commands.length; i++) {
                if(this.commands[i].message.name.toLowerCase() !== args[0].toLowerCase()) continue;
                try {
                    await this.commands[i].runMessage(this, message, args);
                    return;
                } catch (err) {
                    message.reply("There was an error!");
                    console.log(err);
                    return;
                }
            }
            message.reply("Files to find command!");

            return;
        })


    }
    #registerCommands() {
        glob(`${process.cwd().replaceAll("\\", "/")}/dist/Luna/commands/**/*.js`).then(async (files) => {
            for (let i = 0; i < files.length; i++) {
                const COMMAND: any = require(files[i]).default;
                if (!COMMAND?.message?.name) {
                    console.log(files[i] + " is missing required info: message.name!");
                    continue;
                };
                this.commandNames.push(COMMAND.message.name);
                this.commands.push(COMMAND);

                if (this.client.isReady()) {
                    this.client.application?.commands.create(COMMAND?.interaction);
                }
            }
        });
    }
}

export interface command {
    interaction: {
        type?: 1 | 2 | 3;
        name: string;
        name_localizations?: {};
        description: string;
        description_localizations?: {};
        options?: Array<commandOption>;
        default_member_permissions?: string;
        dm_permission?: boolean;
        default_permission?: boolean;
    };
    message: {
        name: string;
        description: string;
        options?: Array<string>;
    };
    runInteraction: (luna: Luna, interaction: CommandInteraction) => any;
    runMessage: (luna: Luna, message: Message, args: Array<string>) => any;
}

interface commandOption {
    type: number;
    name: string;
    name_localizations?: {};
    description: string;
    description_localizations?: {};
    required?: boolean;
    choices?: Array<{
        name: string;
        name_localizations?: {},
        value: number | string;
    }>;
    options?: Array<commandOption>;
    channel_type?: {};
    min_value?: number;
    max_value?: number;
    min_length?: number;
    max_length?: number;
    autocomplete?: boolean;
}

export let CommandOptionType: commandOptionTypes = {
    SUB_COMMAND: 1,
    SUB_COMMAND_GROUP: 2,
    STRING: 3,
    INTEGER: 4,
    BOOLEAN: 5,
    USER: 6,
    CHANNEL: 7,
    ROLE: 8,
    MENTIONABLE: 9,
    NUMBER: 10,
    ATTACHMENT: 11
}

interface commandOptionTypes {
    SUB_COMMAND: 1;
    SUB_COMMAND_GROUP: 2;
    STRING: 3;
    INTEGER: 4;
    BOOLEAN: 5;
    USER: 6;
    CHANNEL: 7;
    ROLE: 8;
    MENTIONABLE: 9;
    NUMBER: 10;
    ATTACHMENT: 11;
}