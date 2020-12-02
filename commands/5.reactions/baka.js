const { MessageEmbed } = require("discord.js");
const client = require("nekos.life");
const { sfw } = new client();

exports.run = async (client, message, args) => {
  try {

    let baka = await sfw.baka();
    let member = message.mentions.members.first()
    if (!args[0]) return message.reply("mention seseorang untuk melanjutkan!")
    const embed = new MessageEmbed();

    if (member) {

      embed.setTitle(`${message.guild.member(member).displayName}  Bodoh! ≡(▔﹏▔)≡`)
      embed.setColor(client.warna.kato)
      embed.setImage(baka.url);

      message.channel.send(embed);
    } else;

    if (message.author.id === member.user.id) {

      embed.setTitle(`()...-'-'-...()`)
      embed.setColor(client.warna.kato)
      embed.setImage(baka.url)

      message.channel.send(embed);
    }

  } catch (error) {
    return message.channel.send(`Something went wrong: ${error.message}`);
    // Restart the bot as usual.
  }
}

exports.conf = {
  aliases: ["bodoh"],
  cooldown: 5
}

exports.help = {
  name: 'baka',
  description: 'reaksi',
  usage: 'k!baka',
  example: 'k!baka'
}