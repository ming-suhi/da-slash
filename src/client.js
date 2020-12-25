const fs = require('fs');

class Client {
  constructor(client, config) {
    this.client = client;
    this.config = config;
  }

  getCommands = () => {
    const dir = this.config.commands.directory;
    const subcategories = this.config.commands.subcategories;
    let map = new Map();
    switch (subcategories) {

      case "true":
        fs.readdirSync(dir).forEach(folder => {

          fs.readdirSync(dir + '/' + folder).forEach(file => {
            let File = require(`${dir}/${folder}/${file}`);
            map.set(File.name, File.data);
          });
        });
        return map;
        break;

      case "false":
        fs.readdirSync(dir).forEach(file => {
          let File = require(`${dir}/${file}`);
          map.set(File.name, File.data);
        });
        return map;
    }
  };

  matchCommand = (interaction) => {
    const dir = this.config.commands.directory;
    const subcategories = this.config.commands.subcategories;

    switch (subcategories) {

      case "true":
        fs.readdirSync(dir).forEach(folder => {

          fs.readdirSync(`${dir}/${folder}`).forEach(file => {
            if (file !== 'index.js') {
              let File = require(`${dir}/${folder}/${file}`);
              File.securityCheck(interaction);
            }
          })
        })
        break;

      case "false":
        fs.readdirSync(dir).forEach(file => {
          if (file !== 'index.js') {
            let File = require(`${dir}/${file}`);
            File.securityCheck(interaction);
          }
        })
    }
  }

  postCommands = () => {
    const client = this.client;
    client.guilds.cache.forEach(guild => {
      this.getCommands().forEach(command => {

        client.api.applications(client.user.id).guilds(guild.id).commands.post({
          data: {
            name: command.name,
            description: command.description,
            options: command.options
          }
        }).catch(() => {
          console.log("Error | Missing guild permission");
          console.log("Commands not updated to guild: " + guild.name)
        });

      })
    })
  }

  deleteCommand = (guild, commandID) => {
    const client = this.client;
    client.api.applications(client.user.id).guilds(guild.id).commands(commandID).delete();
  }
}

module.exports = Client;