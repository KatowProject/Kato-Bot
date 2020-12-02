const { MessageEmbed } = require("discord.js");
const client = require("nekos.life");
const { sfw } = new client();

exports.run = async (client, message, args) => {
  try {
    let kiss = await sfw.kiss();
    let member = message.mentions.members.first();
    if (!args[0]) return message.reply("mention seseorang untuk melanjutkan!");

    const embed = new MessageEmbed();
    if (member) {

      embed.setTitle(`${message.guild.member(message.author).displayName} mencium ${message.guild.member(member).displayName} o(*￣▽￣*)o `)
      embed.setColor(client.warna.kato)
      embed.setImage(kiss.url)

      message.channel.send(embed);
    } else;

    if (message.author.id === member.user.id) {

      embed.setTitle(`Kamu mencium diri sendiri 😳`)
      embed.setColor(client.warna.kato)
      embed.setImage(kiss.url)

      message.channel.send(embed);
    };

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