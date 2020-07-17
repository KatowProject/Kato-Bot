const { MessageEmbed } = require("discord.js");
const client = require("nekos.life");
const { sfw } = new client();

exports.run = async (client, message, args) => {
  try {
    let slap = await sfw.slap();
    let member = message.mentions.members.first()
    if (!args[0]) return message.reply("mention seseorang untuk melanjutkan!")
    if (member) {
      let embed = new MessageEmbed()
        .setTitle(`${message.guild.member(member).displayName}  Bodoh! ≡(▔﹏▔)≡`)
        .setColor("#985ce7")
        .setImage(slap.url);

      message.channel.send(embed);
    } else message.reply("sepertinya terjadi kesalahan");

  } catch (error) {
    return message.channel.send(`Something went wrong: ${error.message}`);
    // Restart the bot as usual.
  }
}

exports.conf = {
  aliases: ["tampar"],
  cooldown: 5
}

exports.help = {
  name: 'slap',
  description: 'reaksi',
  usage: 'k!slap <user>',
  example: 'k!baka @juned'
}