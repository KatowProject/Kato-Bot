const Discord = require('discord.js');
const db = require('../../database').log;

exports.run = async (client, message, args) => {
  try {

    if (!message.guild.me.hasPermission("MANAGE_ROLES")) return message.channel.send("Aku tidak mempunyai akses!");

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

      mutee.roles.remove(role);
      message.channel.send(`${mutee.user.tag} telah selesai diunbisu!`);

      const embed = new Discord.MessageEmbed()
        .setAuthor(`UNMUTE | ${mutee.user.tag}`)
        .setColor(client.warna.kato)
        .addField("User", mutee, true)
        .addField("Moderator", message.author, true)
        .setTimestamp()
        .setFooter(`${message.member.id}`, message.guild.iconURL);

      const getChannel = db.get(message.guild.id).mute;
      if (getChannel === 'null') return message.reply('Untuk mengaktifkan Log, Silahkan jalankan perintah k!logs').then(msg => msg.delete({ timeout: 5000 }));
      client.channels.cache.get(getChannel).send(embed);
    }

  } catch (error) {

    return message.channel.send(`Something went wrong: ${error.message}`);
    // Restart the bot as usual.
  }
}

exports.conf = {
  aliases: ['unmute'],
  cooldown: 5,
  permissions: ['MUTE_MEMBERS']
}

exports.help = {
  name: 'unbisu',
  description: 'Melepaskan Role Muted',
  usage: 'k!unbisu <user/id>',
  example: 'k!unbisu @juned'
}