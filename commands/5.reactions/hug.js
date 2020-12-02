const { MessageEmbed } = require("discord.js");
const client = require("nekos.life");
const { sfw } = new client();

exports.run = async (client, message, args) => {
  try {
    let hug = await sfw.hug();
    let member = message.mentions.members.first();
    if (!args[0]) return message.reply("mention seseorang untuk melanjutkan!");
    const embed = new MessageEmbed();

    if (member) {

      embed.setTitle(`${message.guild.member(message.author).displayName} memeluk ${message.guild.member(member).displayName} (✿◡‿◡)`)
      embed.setColor(client.warna.kato)
      embed.setImage(hug.url)

      message.channel.send(embed);
    } else;

    if (message.author.id === member.user.id) {

      embed.setTitle('Kamu memeluk diri sendiri 😳')
      embed.setColor(client.warna.kato)
      embed.setImage(hug.url)

      message.channel.send(embed);
    };

  } catch (error) {
    return message.channel.send(`Something went wrong: ${error.message}`);
    // Restart the bot as usual.
  }
}

exports.conf = {
  aliases: ["peluk"],
  cooldown: 5
}

exports.help = {
  name: 'hug',
  description: 'reaksi',
  usage: 'k!hug <user>',
  example: 'k!hug @juned'
}