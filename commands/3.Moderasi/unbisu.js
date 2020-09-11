const Discord = require('discord.js');

exports.run = async (client, message, args) => {
  try {

    if (!message.member.hasPermission("MUTE_MEMBERS") || !message.guild.owner) return;
    if (!message.guild.me.hasPermission(["MANAGE_ROLES", "ADMINISTRATOR"])) return message.channel.send("Aku tidak mempunyai akses!");

    if (args[0].toLowerCase() === 'voice') {

      let channel = message.member.voice.channel;
      for (let member of channel.members) {
        member[1].voice.setMute(false)
      };
      message.channel.send('Telah dinonaktifkan!');

    } else {

      const mutee = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
      if (!mutee) return;
      let role = message.guild.roles.cache.find(r => r.name === "Muted");

      mutee.roles.remove(role).then(() => {
        message.channel.send(`${mutee.user.tag} telah selesai diunbisu!`)
      })

      let embed = new Discord.MessageEmbed()
        .setAuthor(`UNMUTE | ${mutee.user.tag}`)
        .setColor(client.warna.kato)
        .addField("User", mutee, true)
        .addField("Moderator", message.author, true)
        .setTimestamp()
        .setFooter(`${message.member.id}`, message.guild.iconURL);

      client.channels.cache.get("438330646537044013").send(embed);
    }
  } catch (error) {
    return message.channel.send(`Something went wrong: ${error.message}`);
    // Restart the bot as usual.
  }
}

exports.conf = {
  aliases: ['unmute'],
  cooldown: 5
}

exports.help = {
  name: 'unbisu',
  description: 'Melepaskan Role Muted',
  usage: 'k!unbisu <user/id>',
  example: 'k!unbisu @juned'
}