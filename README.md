# da-slash
Creating and managing Discord Slash Commands made simple

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
client.ws.on('INTERACTION_CREATE', async interaction => {
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
###### execute - function to be executed, will not be executed if permissions are not met and sends an ephemeral message
#### usage
```javascript
commandOne.js
module.exports = new Slash.Command({
  name: 'hello',
  description: 'sends ',
  permissions: ["SEND_MESSAGES"],
  execute(client, interaction) {
  
    // sends "Hello World!"
    client.api.interactions(interaction.id, interaction.token).callback.post({
      data: {
        type: 4,
        data: {
          content: "Hello World!"
        }
      }
    });
    
  }
})
```


## More Resources
[Discord Slash Commands Documentation](https://discord.com/developers/docs/interactions/slash-commands)