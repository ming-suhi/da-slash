const Discord = require('discord.js');

class Interaction {
  constructor(client, request) {
    this.client = client;
    this.request = request;
    this.responseType = 4;
  }

  async author() {
    let guild = await this.guild();
    let author = await guild.members.fetch(this.request.member.user.id);
    return author;
  }

  async guild() {
    let guild = await this.client.guilds.fetch(this.request.guild_id);
    return guild;
  }

  async channel() {
    let channel = await this.client.channels.fetch(this.request.channel_id);
    return channel;
  }

  async bot() {
    let guild = await this.guild();
    let bot = await guild.members.fetch(this.client.user.id);
    return bot;
  }

  async sendMessage(content) {
    const client = this.client;
    const request = this.request;
    const type = this.responseType;
    const data = {
      type: type,
      data: {
        content: content,
      }
    }
    client.api.interactions(request.id, request.token).callback.post({data});
    return {...data};
  }

  async sendEphemeral(content) {
    const client = this.client;
    const request = this.request;
    const type = this.responseType;
    const data = {
      type: type,
      data: {
        content: content,
        flags: 64
      }
    }
    client.api.interactions(request.id, request.token).callback.post({data});
    return {...data};
  }

  async sendEmbed(embed) {
    const client = this.client;
    const request = this.request;
    const type = this.responseType;
    const data = {
      type: type,
      data: await this.createAPIMessage(embed)
    }
    client.api.interactions(request.id, request.token).callback.post({data});
    return {...data};
  }

  async createAPIMessage(embed) {
    const client = this.client;
    const request = this.request;
    const apiMessage = await Discord.APIMessage.create(client.channels.resolve(request.channel_id), embed)
      .resolveData()
      .resolveFiles()
    return { ...apiMessage.data, files: apiMessage.files };
  }
}

module.exports = Interaction;