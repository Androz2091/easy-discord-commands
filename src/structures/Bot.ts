import { EventEmitter } from "events";
import { Client, ClientOptions, Message, PermissionString } from "discord.js";
import { BotOptions, Command, CommandData } from "../types";

interface MessageData {
    [key: string]: string;
};

export class Bot extends EventEmitter {

    public commands: Command[];
    public messages: MessageData;

    public client?: Client;
    public prefix: string;
    public clientOptions: ClientOptions;
    private token: string;

    constructor(options: BotOptions = {
        prefix: "!",
        token: "",
        clientOptions: {}
    }){
        super();
        this.commands = [];
        this.prefix = options.prefix || "!";
        this.token = options.token || "";
        this.clientOptions = options.clientOptions || {};

        this.messages = {
            missingPermissions: "You don't have the right permissions to run this command!",
            guildOnly: "This command can only be run on a server!"
        };
    }

    setToken(token: string){
        this.token = token;
    }

    setPrefix(prefix: string){
        this.prefix = prefix;
    }

    setClientOptions(options: ClientOptions){
        this.clientOptions = options;
    }

    connect(){
        this.client = new Client(this.clientOptions || {});
        this.client.on('message', this.handleMessage);
        this.client.login(this.token);
    }

    addCommand(commandName: string, commandData: CommandData){
        this.commands.push({
            name: commandName,
            data: commandData || {}
        });
    }

    handleMessage(message: Message) {
        const args = message.content.slice(this.prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();
        const cmd = this.commands.find((c) => c.name === command || (c.data.aliases || []).includes(command));
        if(cmd){
            if(message.guild){
                if(
                    (cmd.data.ownerOnly && (message.guild.ownerID !== message.author.id)) ||
                    (cmd.data.permissions && !message.member.hasPermission(cmd.data.permissions))
                ){
                    return message.channel.send(this.messages.missingPermissions);
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