import { ClientOptions } from "discord.js";

export interface BotOptions {
    prefix: string;
    token: string;
    clientOptions: ClientOptions;
};