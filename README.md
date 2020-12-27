# Quick Setup
## Installation
##### Run npm install on command line or terminal.
```
npm install da-slash
```
## Initialization
##### Set up bot and listen for commands.
```javascript
index.js

const config = {
"commands": {
    "directory": "/path/to/commands", //path to commands folder
    "subcategories": "false" //if commands are divided by folders change to "true"
  },
  "bot": {
    "token": "bot_token_here"
  }    
}

const Discord = require('discord.js');
const client = new Discord.Client();
const Slash = require('da-slash');
const slash = new Slash.Client(client, config);

client.once('ready', () => {
  //updates Commands
  slash.postCommands();
  
  //deletes Command
  slash.deleteCommand(guild_id_here, command_id_here)
})

client.on('guildCreate', guild => {
  //refreshes Commands to show changes at new guild
  slash.postCommands();
})

//emitted when a slash command is detected
client.ws.on('INTERACTION_CREATE', async request => {
  const interaction = new Slash.Interaction(client, request);
  //finds the matching slash command and executes it
  slash.matchCommand(interaction); 
})

client.login(config.bot.token);
```

## Creating Commands
##### A file for each command. All files should be contained in one folder or if files are separated by folders, all command folders should be under one command folder. 
```javascript
commandOne.js

const Slash = require('da-slash');
module.exports = new Slash.Command({
  name: 'echo',
  description: 'sends a message',
  permissions: ["SEND_MESSAGES"],
  options: [{
    "name": "content",
    "description": "message the bot will send",
    "type": 3 // Type 3 is string
  }]
  execute(interaction) {
    // access discord.Client() through interaction.client
    const client = interaction.client;
    // access the data related to the slash command emitted
    const request = interaction.request;
    // access the arguments passed
    const content = request.data.options.find(arg => arg.name === "content").value;
    // sends message containing the argument
    interaction.sendMessage(content);
  }
})
```

## Resources

[da-slash Documentation](https://github.com/xlyr-on/da-slash/wiki)

[Discord Slash Commands Documentation](https://discord.com/developers/docs/interactions/slash-commands)

[Discord.js Documentation](https://discord.js.org/#/docs/main/stable/general/welcome)
