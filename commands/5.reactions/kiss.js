const { MessageEmbed } = require("discord.js");
const client = require("nekos.life");
const { sfw } = new client();

exports.run = async (client, message, args) => {
  try {
    let kiss = await sfw.kiss();
    let member = message.mentions.members.first()
    if (!args[0]) return message.reply("mention seseorang untuk melanjutkan!")
    if (member) {
      let embed = new MessageEmbed()
        .setTitle(`${message.guild.member(message.author).displayName} mencium ${message.guild.member(member).displayName} o(*￣▽￣*)o `)
        .setColor("#985ce7")
        .setImage(kiss.url);

      message.channel.send(embed);
    } else message.reply("sepertinya terjadi kesalahan");

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