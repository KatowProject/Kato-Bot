const { MessageEmbed } = require("discord.js");
const axios = require('axios');

exports.run = async (client, message, args) => {
  try {
    const response = await axios.get('https://nekos.life/api/v2/img/kiss');
    const kiss = response.data;

    let member = message.mentions.members.first();
    if (!args[0]) return message.reply("mention seseorang untuk melanjutkan!");
    const embed = new MessageEmbed();

    if (message.author.id === member.user.id) {
      embed.setTitle(`Kamu mencium diri sendiri 😳`)
      embed.setColor(client.warna.kato)
      embed.setImage(kiss.url)

      message.channel.send({ embeds: [embed] });
    } else {
      embed.setTitle(`${message.guild.members.cache.get(message.author.id).displayName} mencium ${message.guild.members.cache.get(member.user.id).displayName} o(*￣▽￣*)o `)
      embed.setColor(client.warna.kato)
      embed.setImage(kiss.url)

      message.channel.send({ embeds: [embed] });
    }

  } catch (error) {
    return message.channel.send(`Something went wrong: ${error.message}`);
    // Restart the bot as usual.
  }
}

exports.conf = {
  aliases: ["cium"],
  cooldown: 5
}

exports.help = {
  name: 'kiss',
  description: 'reaksi',
  usage: 'k!kiss <@user>',
  example: 'k!kiss @juned   '
}