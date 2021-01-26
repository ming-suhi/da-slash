const fs = require('fs');

class Client {
  constructor(client, config) {
    this.client = client;
    this.config = config;
  }

  async commands() {
    const dir = this.config.commands.directory;
    const folder = fs.readdirSync(dir);
    const subcategories = this.config.commands.subcategories;
    let commands = new Map();
    switch (subcategories) {

      case "true":
        for (let subfolderRef of folder) {
          const subfolder = fs.readdirSync(`${dir}/${subfolderRef}`);
          for (let file of subfolder) {
            if (file === "index.js") return;
            let command = require.main.require(`${dir}/${folder}/${file}`);
            commands.set(command.name, command);
          }
        }
        return commands;
        break;

      case "false":
        for (let file of folder) {
          let command = require.main.require(`${dir}/${file}`);
          commands.set(command.name, command);
        }
        return commands;
    }
  };
  
  async findCommand(command_name) {
    const dir = this.config.commands.directory;
    const folder = fs.readdirSync(dir);
    const subcategories = this.config.commands.subcategories;
    let map = new Array();
    switch (subcategories) {

      case "true":
        for(let subfolderRef of folder) {
          const subfolder = fs.readdirSync(`${dir}/${subfolderRef}`);
          for (let file of subfolder) {
            if (file === "index.js") return;
            let command = require.main.require(`${dir}/${subfolderRef}/${file}`);
            let expressionCheck = await command.expressionCheck(command_name);
            if (expressionCheck.pass){
              map.push(command)
            }
          }
        }
        break;

      case "false":
        for (let file of folder) {
          if (file === "index.js") return;
          let command = require.main.require(`${dir}/${file}`);
          let expressionCheck = await command.expressionCheck(command_name);
          if (expressionCheck.pass){
            map.push(command)
          }
        }
    }
    return map[0];
  }

  async matchCommand(interaction){
    const command = await this.findCommand(interaction.request.data.name);
    const securityCheck = await command.securityCheck(interaction);
    switch (securityCheck.pass) {
      case true:
      command.execute(interaction);
      return {...command, securityCheck: "pass"};
      break;
    
      case false:
      const user = await interaction.author();
      const missingPermissions = (this.permissions || ['SEND_MESSAGES']).filter(p => !user.hasPermission(p));
      interaction.responseType = 3;
      interaction.sendEphemeral(`You are missing permissions to run this command: \`${permissionCheck.missingPermissions.join(' | ').replace(/_/g, ' ')}\``);
      return {...command, securityCheck: "pass"};
    }
  }

  async postCommands() {
    let commands = await this.commands();
    for (let command of commands) {
      command[1].post(this.client)
    }
    return commands;
  }
}

module.exports = Client;
