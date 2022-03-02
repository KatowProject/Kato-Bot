const Discord = require('discord.js');
const db = require('../../database').log;

exports.run = async (client, message, args) => {
  try {

    const dataGuild = db.get(message.guild.id);

    if (!message.guild.me.hasPermission("MANAGE_ROLES")) return message.channel.send("Aku tidak mempunyai akses!");

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

      mutee.roles.add(role);
      message.channel.send(`${mutee.user.tag} telah selesai di mute.\nAlasan : ${reason}`);

      let embed = new Discord.MessageEmbed()
        .setAuthor(`MUTE | ${mutee.user.tag}`)
        .setColor(client.warna.kato)
        .addField("User", mutee, true)
        .addField("Moderator", message.author, true)
        .addField("Alasan", reason, true)
        .setTimestamp()
        .setFooter(`${message.member.id}`, message.guild.iconURL);

      const getChannel = dataGuild.mute;
      if (getChannel === 'null') return message.reply('Untuk mengaktifkan Log silahkan ketik k!logs').then(msg => msg.delete({ timeout: 5000 }));
      client.channels.cache.get(getChannel).send(embed);

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
  permissions: ['MUTE_MEMBERS']
}

exports.help = {
  name: 'bisu',
  description: 'Memberikan Role Muted kepada Member',
  usage: 'k!bisu <user> [reason]',
  example: 'k!bisu @juned spam'
}