const Discord = require('discord.js');

exports.run = async (client, message, args) => {
  try {
    if (!message.guild.me.permissions.has("MUTE_MEMBERS")) return message.channel.send("Aku tidak mempunyai akses!");
    if (!message.member.permissions.has("MUTE_MEMBERS")) return message.channel.send("Kamu tidak memiliki izin untuk menggunakan perintah ini!");

    if (args[0] === 'voice') {
      let channel = message.member.voice.channel;
      for (let member of channel.members) {
        member[1].voice.setMute(false)
      };
      message.channel.send('Telah dinonaktifkan!');
    } else {
      const mutee = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
      if (!mutee) return;

      mutee.timeout(0).then(() => {
        message.channel.send(`${mutee.user.tag} telah diunmute!`);
      });

      let embed = new Discord.MessageEmbed()
        .setAuthor(`UNMUTE | ${mutee.user.tag}`)
        .setColor('RANDOM')
        .addField("User", `${mutee.id}`, true)
        .addField("Moderator", `${message.author.id}`, true)
        .setTimestamp()
        .setFooter(`${message.member.id}`, message.guild.iconURL);

      client.channels.cache.get(client.config.channel["warn-activity"]).send({ embeds: [embed] });
    }
  } catch (error) {
    return message.channel.send(`Something went wrong: ${error.message}`);
    // Restart the bot as usual.
  }
}

exports.conf = {
  aliases: [],
  cooldown: 5,
  location: __filename
}

exports.help = {
  name: 'unbisu',
  description: 'Melepaskan Role Muted',
  usage: 'k!unbisu <user/id>',
  example: 'k!unbisu @juned'
}