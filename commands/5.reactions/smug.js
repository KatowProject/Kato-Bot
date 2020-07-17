const { MessageEmbed } = require("discord.js");
const client = require("nekos.life");
const { sfw } = new client();

exports.run = async (client, message, args) => {
  try {
    let smug = await sfw.smug();
    let member = !args[0];
    if (member) {
      let embed = new MessageEmbed()
        .setTitle(`${message.guild.member(message.author).displayName}  Menyombongkan Diri! ( •̀ ω •́ )y`)
        .setColor("#985ce7")
        .setImage(smug.url);

      message.channel.send(embed);
    } else message.reply("sepertinya terjadi kesalahan");

  } catch (error) {
    return message.channel.send(`Something went wrong: ${error.message}`);
    // Restart the bot as usual.
  }
}

exports.conf = {
  aliases: [],
  cooldown: 5
}

exports.help = {
  name: 'smug',
  description: 'reaksi',
  usage: 'k!smug',
  example: 'k!smug'
}