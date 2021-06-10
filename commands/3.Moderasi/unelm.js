const Discord = require('discord.js');
const db = require('quick.db');
const { log, elm } = require('../../database');

exports.run = async (client, message, args) => {

  try {
    if (!message.guild.me.hasPermission("MANAGE_ROLES")) return message.channel.send("Aku tidak mempunyai akses!");

    let korban = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!korban) return message.channel.send("tag user yang ingin di unelm!");

    const user = elm.get(korban.user.id);
    if (!user) return message.reply('Data tidak ditemukan!').then(msg => msg.delete({ timeout: 5000 }));

    for (role of user) {
      korban.roles.add(role);
    }

    const ELM = message.guild.roles.cache.get("505004825621168128");
    korban.roles.remove(ELM).then(() => {
      message.delete()

      message.channel.send(`**${korban.user.username}#${korban.user.discriminator}** telah selesai di unelm.`)
    })

    elm.delete(korban.user.id);

    const embed = new Discord.MessageEmbed()
      .setAuthor(`UNELM | ${korban.user.tag}`)
      .setColor(client.warna.kato)
      .addField("User", korban, true)
      .addField("Moderator", message.author, true)
      .setTimestamp()
      .setFooter(`${message.member.id}`, message.guild.iconURL)

    const getChannel = log.get(message.guild.id).elm;
    if (getChannel === 'null') return message.reply('Untuk mengaktifkan Log silahkan ketik k!logs');
    client.channels.cache.get(getChannel).send(embed);

  } catch (error) {
    return message.channel.send(`Something went wrong: ${error.message}`);
    // Restart the bot as usual.
  }
}

exports.conf = {
  aliases: ["bebas"],
  cooldown: 5,
  permissions: ['MUTE_MEMBERS']
}

exports.help = {
  name: 'unelm',
  description: 'melepaskan role ELM',
  usage: 'k!unelm <user>',
  example: 'k!unelm @juned'
}