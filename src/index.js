const config = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();
const Slash = require('./da-slash.js');
const slash = new Slash.Client(client, config);

client.once('ready', () => {
  slash.postCommands();
})

client.ws.on('INTERACTION_CREATE', async interaction => {
  slash.matchCommand(interaction);
})

client.login(config.bot.token)


