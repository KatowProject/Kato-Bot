const Discord = require('discord.js');

exports.run = async (client, message, args) => {
  try {
    if (!message.member.hasPermission("MUTE_MEMBERS") || !message.guild.owner) return;
    if (!message.guild.me.hasPermission(["MANAGE_ROLES", "ADMINISTRATOR"])) return message.channel.send("Aku tidak mempunyai akses!");

    if (args[0] === 'voice') {
      let channel = message.member.voice.channel;
      for (let member of channel.members) {
        member[1].voice.setMute(true)
      };
      message.channel.send('Telah diaktifkan!');
    } else {

      let mutee = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
      if (!mutee) return;
      let role = message.guild.roles.cache.find(r => r.name === "Muted");

      let reason = args.slice(1).join(" ");
      if (!reason) reason = "tidak diberi alasan";

      mutee.roles.add(role).then(() => {
        message.channel.send(`${mutee.user.tag} telah selesai di mute.\nAlasan : ${reason}`)
      });

      let embed = new Discord.MessageEmbed()
        .setAuthor(`MUTE | ${mutee.user.tag}`)
        .setColor(client.warna.kato)
        .addField("User", mutee, true)
        .addField("Moderator", message.author, true)
        .addField("Alasan", reason, true)
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
  aliases: ['mute'],
  cooldown: 5
}

exports.help = {
  name: 'bisu',
  description: 'Memberikan Role Muted kepada Member',
  usage: 'k!bisu <user> [reason]',
  example: 'k!bisu @juned spam'
}