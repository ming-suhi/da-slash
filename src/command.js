class Command {
  constructor(data) {
    Object.assign(this, data);
  }

  async expressionCheck(command_name) {
    if (command_name === this.name) {
      return {...this, pass: true};
    } else {
      return {...this, pass: false};
    }
  }

  async permissionCheck(user) {
    const missingPermissions = (this.permissions || ['SEND_MESSAGES']).filter(p => !user.hasPermission(p))
    if (missingPermissions.length === 0) {
      return {...this, pass: true};
    } else {
      return {...this, pass: false};
    }
  }

  async securityCheck(interaction) {
    const client = interaction.client;
    const request = interaction.request;
    const command = request.data;
    const guild = client.guilds.cache.get(request.guild_id);
    const user = await interaction.author();
    const expressionCheck = await this.expressionCheck(command.name);
    if (!expressionCheck) return;
    const permissionCheck = await this.permissionCheck(user);
    if (permissionCheck.pass) {
      return {...this, pass: true};
    } else {
      return {...this, pass: false};
    }
  }
}

module.exports = Command;