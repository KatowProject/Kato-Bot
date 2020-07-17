const Discord = require('discord.js');

exports.run = async (client, message, args) => {
  try {
    if (!message.member.hasPermission("MUTE_MEMBERS") || !message.guild.owner) return message.channel.send('Kamu tidak Mempunyai Akses!');
    if (!message.guild.me.hasPermission(["MANAGE_ROLES", "ADMINISTRATOR"])) return message.channel.send("Aku tidak mempunyai akses!");

    const mutee = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!mutee) return message.channel.send("Tag user yang ingin di bisukan!");
    let role = message.guild.roles.cache.find(r => r.name === "Muted");

    mutee.roles.remove(role).then(() => {
      message.channel.send(`${mutee.user.tag} telah selesai diunbisu!`).catch(() => console.log('oke'))
    })

    let embed = new Discord.MessageEmbed()
      .setAuthor(`UNMUTE | ${mutee.user.tag}`)
      .setColor(client.warna.kato)
      .addField("User", mutee, true)
      .addField("Moderator", message.author, true)
      .setTimestamp()
      .setFooter(`${message.member.id}`, message.guild.iconURL);

    client.channels.cache.get("438330646537044013").send(embed);

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
  name: 'unbisu',
  description: 'Melepaskan Role Muted',
  usage: 'k!unbisu <user/id>',
  example: 'k!unbisu @juned'
}