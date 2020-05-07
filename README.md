# Easy Discord Commands

Simple Discord bot framework.

## Example

```js
const { Bot, BaseCommands } = require("easy-discord-commands");

const bot = new Bot()
.setToken("YOUR_DISCORD_TOKEN") // define bot token
.setPrefix("!"); // define bot prefix

// Register a new simple command
bot.addCommand({
    name: "test",
    reply: "You ran the test command"
});

// Register a new complex command
bot.addCommand({
    name: "say",
    run: (message, args) => {
        message.delete();
        message.channel.send(args.join(" "));
    },
    aliases: [ "tell" ],
    ownerOnly: true, // or use permissions, like below
    permissions: [ "ADMINISTRATOR" ],
    guildOnly: true // command can only be run on a server
});

// Register base commands
bot.addCommand({
    name: "ping",
    run: BaseCommands.ping.data.run
});

// Define Discord.js client options
bot.setClientOptions({
    fetchAllMembers: true
})
.connect(); // log in to Discord

// You can use events
bot.client.on("ready", () => {
    console.log("The bot is ready");
});
```
