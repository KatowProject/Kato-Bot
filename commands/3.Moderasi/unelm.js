const Discord = require('discord.js');
const db = require('quick.db');

exports.run = async (client, message, args) => {
  try {
    if (!message.member.hasPermission("MUTE_MEMBERS") || !message.guild.owner) return;
    if (!message.guild.me.hasPermission(["MANAGE_ROLES", "ADMINISTRATOR"])) return message.channel.send("Aku tidak mempunyai akses!");

    let korban = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!korban) return message.channel.send("tag user yang ingin di unelm!");

    //cari data
    let data = new db.table('ELMs')
    let elm = await data.fetch(korban.user.id)
    if (elm === null) return;
    let elm_role = data.get(korban.user.id)

    for (let i = 0; i < elm_role.length; i++) {
      korban.roles.add(elm_role[i])
    }

    let ELM = message.guild.roles.cache.get("505004825621168128");
    korban.roles.remove(ELM).then(() => {
      message.delete()

      message.channel.send(`**${korban.user.username}#${korban.user.discriminator}** telah selesai di unelm.`)
    })

    await data.delete(korban.user.id)

    let embed = new Discord.MessageEmbed()
      .setAuthor(`UNELM | ${korban.user.tag}`)
      .setColor(client.warna.kato)
      .addField("User", korban, true)
      .addField("Moderator", message.author, true)
      .setTimestamp()
      .setFooter(`${message.member.id}`, message.guild.iconURL)

    client.channels.cache.get("438330646537044013").send(embed);
  } catch (error) {
    return message.channel.send(`Something went wrong: ${error.message}`);
    // Restart the bot as usual.
  }
}

exports.conf = {
  aliases: ["bebas"],
  cooldown: 5
}

exports.help = {
  name: 'unelm',
  description: 'melepaskan role ELM',
  usage: 'k!unelm <user>',
  example: 'k!unelm @juned'
}