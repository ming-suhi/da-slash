# da-slash
Creating and managing Discord Slash Commands made simple

[![Github License](https://img.shields.io/github/license/xlyr-on/da-slash)](https://img.shields.io/github/license/)
[![Github Issues](https://img.shields.io/github/issues/xlyr-on/da-slash)](https://img.shields.io/github/issues/)

## Slash Client
#### constructor 
```javascript
new Slash.Client(discord_client, config);
```
#### methods
###### .getCommands() - Returns a map of commands
###### .postCommands() - Posts/updates all commands
###### .deleteCommand(guild, command_id_here) - Deletes chosen command from a certain guild
###### .matchCommand(interaction) - runs through all commands and executes match
#### usage
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
  let guild = client.guilds.cache.get(guild_id_here);
  slash.deleteCommand(guild, command_id_here)
})

//emitted when a slash command is detected
client.ws.on('INTERACTION_CREATE', async request => {
  const interaction = new Slash.Interaction(client, request);
  //finds the appropriate slash command and executes it
  slash.matchCommand(interaction); 
})

client.login(config.bot.token);
```


## Slash Command
#### constructor 
```javascript
new Slash.Command(data);
```
#### data
###### name - name of command
###### description - description of command
###### permissions - required permissions to execute command
###### options - options for command
###### execute - function to be executed, will not be executed if permissions are not met
#### usage
```javascript
commandOne.js
module.exports = new Slash.Command({
  name: 'hello',
  description: 'sends a hello world message',
  permissions: ["SEND_MESSAGES"],
  execute(interaction) {
  
    interaction.sendMessage("Hello World")
    
  }
})
```


## Slash Interaction
#### constructor
```javascript
new Slash.Interaction(discord_client, interaction)
```
#### methods
###### .sendMessage(content) - sends a message
###### .sendEphemeral(content) - sends an ephemeral(user-visible only) message
###### .sendEmbed(discord_embed) - sends an embed
#### usage
```javascript
commandTwo.js
module.exports = new Slash.Command({
  name: 'invisible',
  description: 'sends a hello world message visible to user only',
  permissions: ["SEND_MESSAGES"],
  execute(interaction) {
  
    interaction.sendEphemeral("Hello World")
    
  }
})
```


## More Resources
[Discord Slash Commands Documentation](https://discord.com/developers/docs/interactions/slash-commands)
