import { Command } from "./types";

export const ping: Command = {
    name: "ping",
    data: {
        run: (message, args) => {
            return message.channel.send("🏓 Pong! (`"+message.client.ws.ping+"` ms)");
        }
    }
};
