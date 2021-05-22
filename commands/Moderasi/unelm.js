const Discord = require('discord.js');
const ELM = require('../../database/schema/ELMs');

exports.run = async (client, message, args) => {
  try {

    if (!message.guild.me.hasPermission("MANAGE_ROLES")) return message.channel.send("Aku tidak mempunyai akses!");

    let korban = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!korban) return message.channel.send("tag user yang ingin di unelm!");

    //cari data
    const member = await ELM.findOne({ userID: korban.id });
    if (!member) return message.reply('Member gk kena ELM!');

    for (const user of member.roles) {
      korban.roles.add(user);
    }

    let ELMs = message.guild.roles.cache.get("505004825621168128");
    korban.roles.remove(ELMs).then(() => {
      message.delete()
      message.channel.send(`**${korban.user.username}#${korban.user.discriminator}** telah selesai di unelm.`)
    })

    await ELM.findOneAndDelete({ userID: korban.id });

    let embed = new Discord.MessageEmbed()
      .setAuthor(`UNELM | ${korban.user.tag}`)
      .setColor(client.warna.kato)
      .addField("User", korban, true)
      .addField("Moderator", message.author, true)
      .setTimestamp()
      .setFooter(`${message.member.id}`, message.guild.iconURL)

    client.channels.cache.get("795778726930677790").send(embed);
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