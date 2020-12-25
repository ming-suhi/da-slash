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

  matchCommand = (client, interaction) => {
    const dir = this.config.commands.directory;
    const subcategories = this.config.commands.subcategories;

    switch (subcategories) {

      case "true":
        fs.readdirSync(dir).forEach(folder => {

          fs.readdirSync(`${dir}/${folder}`).forEach(file => {
            if (file !== 'index.js') {
              let File = require(`${dir}/${folder}/${file}`);
              File.securityCheck(client, interaction);
            }
          })
        })
        break;

      case "false":
        fs.readdirSync(dir).forEach(file => {
          if (file !== 'index.js') {
            let File = require(`${dir}/${file}`);
            File.securityCheck(client, interaction);
          }
        })
    }
  }

  postCommands = (client) => {
    client.guilds.cache.forEach(guild => {
      this.getCommands().forEach(command => {
        client.api.applications(client.user.id).guilds(guild.id).commands.post({
          data: {
            name: command.name,
            description: command.description,
            options: command.options
          }
        });
      })
    })
  }

  deleteCommand = (client, guild, commandID) => {
    client.api.applications(client.user.id).guilds(guild.id).commands(commandID).delete();
  }
}

class Command {
  constructor(data) {
    this.name = data.name;
    this.data = data;
  }
  
  expressionCheck = (command) => {
    return new Promise((resolve, reject) => {
      if (command.name === this.data.name) {
        resolve();
      }
    })
  }

  permissionCheck = (user) => {
    return new Promise ((resolve, reject) => {
      const missingPermissions = (this.data.permissions || ['SEND_MESSAGES']).filter(p => !user.hasPermission(p))
      if(missingPermissions.length === 0) {
        resolve(this.data.execute);
      } else {
        reject(missingPermissions)
      }
    })
  }

  securityCheck = (client, interaction) => {
    const command = interaction.data;
    const guild = client.guilds.cache.get(interaction.guild_id);
    
    const user = guild.members.fetch(interaction.member.user.id).then(user => {
      this.expressionCheck(command).then(() => {
        this.permissionCheck(user).then(execute => {
        execute(client, interaction);
        }, permissions => {
          client.api.interactions(interaction.id, interaction.token).callback.post({
          data: {
            type: 3,
            data: {
              content: `You are missing permissions to run this command: \`${permissions.join(' | ').replace(/_/g, ' ')}\``,
              flags: 64
            }
          }
          })
        }).catch(console.error)
      }).catch(console.error)
    })
  }
}

exports.Client = Client;
exports.Command = Command;
