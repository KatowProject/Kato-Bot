const Discord = require('discord.js');

exports.run = async (client, message, args) => {
  try {
    if (!message.guild.me.permissions.has("MUTE_MEMBERS")) return message.channel.send("Aku tidak mempunyai akses!");
    if (!message.member.permissions.has("MUTE_MEMBERS")) return message.channel.send("Kamu tidak memiliki izin untuk menggunakan perintah ini!");

    if (args[0] === 'voice') {
      let channel = message.member.voice.channel;
      for (let member of channel.members) {
        member[1].voice.setMute(true)
      };
      message.channel.send('Telah diaktifkan!');
    } else {

      let mutee = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
      if (!mutee) return;

      let reason = args.slice(1).join(" ");
      if (!reason) reason = "tidak diberi alasan";

      //give timeout
      mutee.timeout(require('ms')("28d"), reason).then(() => {
        message.channel.send(`${mutee.user.tag} telah di mute!`);
      });

      let embed = new Discord.MessageEmbed()
        .setAuthor(`MUTE | ${mutee.user.tag}`)
        .setColor('RANDOM')
        .addField("User", `<@${mutee.id}>`, true)
        .addField("Moderator", `<@${message.author.id}>`, true)
        .addField("Alasan", reason, true)
        .setTimestamp()
        .setFooter(`${message.member.id}`, message.guild.iconURL());

      client.channels.cache.get(client.config.channel["warn-activity"]).send({ embeds: [embed] });
    }
  } catch (error) {
    console.log(error);
    return message.channel.send(`Something went wrong: ${error.message}`);
    // Restart the bot as usual.
  }
}

exports.conf = {
  aliases: ['mute'],
  cooldown: 5,
  permissions: ['MUTE_MEMBERS'],
  location: __filename
}

exports.help = {
  name: 'bisu',
  description: 'Memberikan Role Muted kepada Member',
  usage: 'k!bisu <user> [reason]',
  example: 'k!bisu @juned spam'
}