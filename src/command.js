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
      return new Promise((resolve, reject) => {
        const missingPermissions = (this.data.permissions || ['SEND_MESSAGES']).filter(p => !user.hasPermission(p))
        if (missingPermissions.length === 0) {
          resolve(this.data.execute);
        } else {
          reject(missingPermissions)
        }
      })
    }
  
    securityCheck = (interaction) => {
      const client = interaction.client;
      const request = interaction.request;
      const command = interaction.request.data;
      const guild = client.guilds.cache.get(request.guild_id);
  
      const user = guild.members.fetch(request.member.user.id).then(user => {
        this.expressionCheck(command).then(() => {
          this.permissionCheck(user).then(execute => {
            execute(interaction);
          }, permissions => {
            client.api.interactions(request.id, request.token).callback.post({
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
  
  module.exports = Command;