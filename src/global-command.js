const Command = require('./command.js');

class GlobalCommand extends Command{
  constructor(data) {
    super();
    Object.assign(this, data);
  }
  
  async id(client) {
    const commands = await client.api.applications(client.user.id).commands.get();
    const command = commands.find(command => command.name === this.name);
    const id = command.id;
    return id;
  }

  async post(client, guilds = this.guilds) {
    const guildOnly = this.guildOnly;
    const data = {
      name: this.name,
      description: this.description,
      options: this.options
    }
    client.api.applications(client.user.id).commands.post({data: data})
    .catch(console.error);
    return this;
  }

  async delete(client) {
    const command = await this.id(client);
    const guildOnly = this.guildOnly;
    client.api.applications(client.user.id).commands(command.id).delete()
    .catch(console.error)
    return this;
  }
}

module.exports = GlobalCommand;