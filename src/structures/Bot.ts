import { EventEmitter } from "events";
import { Client, ClientOptions, Message, PermissionString, TextChannel } from "discord.js";
import { BotOptions, Command, CommandData } from "../types";

interface MessageData {
    [key: string]: string;
};

export class Bot extends EventEmitter {

    public commands: Command[];
    public messages: MessageData;

    public client?: Client;
    public prefix: string;
    public prefixShownOnMention: boolean;
    public clientOptions: ClientOptions;
    private token: string;

    constructor(options: BotOptions = {
        prefix: "!",
        token: "",
        clientOptions: {},
        showPrefixOnMention: true
    }){
        super();
        this.commands = [];
        this.prefix = options.prefix || "!";
        this.token = options.token || "";
        this.prefixShownOnMention = options.showPrefixOnMention || true;
        this.clientOptions = options.clientOptions || {};

        this.messages = {
            memberMissingPermissions: "You don't have the right permissions to run this command!",
            botMissingPermissions: "I don't have the right permissions to run this command!",
            guildOnly: "This command can only be run on a server!",
            showPrefix: "the prefix of this server is {{prefix}}!"
        };
    }

    setToken(token: string): Bot {
        this.token = token;
        return this;
    }

    setPrefix(prefix: string): Bot {
        this.prefix = prefix;
        return this;
    }

    showPrefixOnMention(newStatus: boolean): Bot {
        this.prefixShownOnMention = newStatus;
        return this;
    }

    setClientOptions(options: ClientOptions): Bot {
        this.clientOptions = options;
        return this;
    }

    updateMessages(messages: MessageData): Bot {
        for(const i in messages){
            this.messages[i] = messages[i];
        }
        return this;
    }

    connect(){
        return new Promise((resolve) => {
            this.client = new Client(this.clientOptions || {});
            this.client.on('message', (message) => this.handleMessage.call(this, message));
            this.client.on('ready', resolve);
            this.client.login(this.token);
        });
    }

    addCommand(commandName: string, commandData: CommandData): Bot{
        this.commands.push({
            name: commandName,
            data: commandData || {}
        });
        return this;
    }

    handleMessage(message: Message) {
        if (message.content.match(new RegExp(`^<@!?${this.client.user.id}>( |)$`))) {
            message.reply(this.messages.showPrefix.replace("{{prefix}}", this.prefix));
        }
        const args = message.content.slice(this.prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();
        const cmd = this.commands.find((c) => c.name === command || ((c.data.aliases || []).includes(command)));
        if(cmd){
            if(message.guild){
                if(
                    (cmd.data.ownerOnly && (message.guild.ownerID !== message.author.id)) ||
                    (cmd.data.memberPermissions && !message.member.hasPermission(cmd.data.memberPermissions))
                ){
                    return message.channel.send(this.messages.memberMissingPermissions);
                }
                if(cmd.data.botPermissions && !(message.channel as TextChannel).permissionsFor(message.guild.me).has(cmd.data.botPermissions)){
                   return message.channel.send(this.messages.botMissingPermissions);
                }
            } else if(cmd.data.guildOnly){
                return message.channel.send(this.messages.guildOnly);
            }
            if(cmd.data.reply){
                message.reply(cmd.data.reply);
            } else if(cmd.data.run){
                cmd.data.run(message, args);
            }
        }
    }

};
