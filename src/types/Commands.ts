import { Message, PermissionString } from "discord.js";

export interface CommandCallback {
    (message: Message, args: string[]): any;
};

export interface CommandData {
    run?: CommandCallback;
    reply?: string;
    ownerOnly?: boolean;
    botPermissions?: PermissionString[];
    memberPermissions?: PermissionString[];
    aliases?: string[];
    guildOnly?: boolean;
};

export interface Command {
    name: string;
    data: CommandData;
};
