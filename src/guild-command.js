const Command = require('./command.js');

class GuildCommand extends Command {
  constructor(data) {
    super();
    Object.assign(this, data);
  }
  
  async id(client, guilds = this.guilds) {
    let map = new Array();
    for (let guild of guilds) {
      const commands = await client.api.applications(client.user.id).guilds(guild).commands.get();
      const command = commands.find(command => command.name === this.name);
      const id = command.id;
      map.push({guild: guild, id: id});
    }
    return map;
  }

  async post(client, guilds = this.guilds) {
    const data = {
      name: this.name,
      description: this.description,
      options: this.options
    }
    for (let guild of guilds) {
    client.api.applications(client.user.id).guilds(guild).commands.post({data: data})
    .catch(console.error);
    }
      
    return this;
  }

  async delete(client) {
    const command = await this.id(client);
    for (let commands of command) {
      client.api.applications(client.user.id).guilds(commands.guild).commands(commands.id).delete().catch(console.error)
    }
  
    return this;
  }
}

module.exports = GuildCommand;