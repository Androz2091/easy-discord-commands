# Easy Discord Commands

Simple Discord bot framework.

## Installation

```sh
npm install easy-discord-commands
```

## Methods

### Create bot instance

```js
const EasyDiscordCommands = require("easy-discord-commands");
const bot = new EasyDiscordCommands.Bot();
bot
.setToken("YOUR_DISCORD_BOT_TOKEN")
.setPrefix("!")
.showPrefixOnMention(true)
.connect();

// Now, you can add commands
```

### Add commands

```js
// Simple command
bot.addCommand("test", {
    reply: "You ran test command!"
});

// Complex command
bot.addCommand("say", {
    run: (message, args) => {
        message.delete();
        message.channel.send(args.join(" "));
    },
    aliases: [ "tell" ],
    ownerOnly: true, // or use permissions, like below
    botPermissions: [ "SEND_MESSAGES" ],
    memberPermissions: [ "ADMINISTRATOR" ],
    guildOnly: true // command can only be run on a server
});
```

## Example

```js
const { Bot, BaseCommands } = require("easy-discord-commands");

const bot = new Bot()
.setToken("YOUR_DISCORD_BOT_TOKEN") // define bot token
.setPrefix("!"); // define bot prefix

// Register a new simple command
bot.addCommand("test", {
    reply: "You ran the test command"
});

// Register a new complex command
bot.addCommand("say", {
    run: (message, args) => {
        message.delete();
        message.channel.send(args.join(" "));
    },
    aliases: [ "tell" ],
    ownerOnly: true, // or use permissions, like below
    botPermissions: [ "SEND_MESSAGES" ],
    memberPermissions: [ "ADMINISTRATOR" ],
    guildOnly: true // command can only be run on a server
});

// Register base commands
bot.addCommand("ping", {
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
