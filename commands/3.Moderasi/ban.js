const Discord = require('discord.js');
const { Client, Message, MessageEmbed } = require('discord.js');

/**
 * @param {Client} client
 * @param {Message} message
 * @param {[]} args
 */
exports.run = async (client, message, args) => {

  try {

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    let reason = args.slice(1).join(" ") || "Tidak ada alasan";
    let author = message.guild.members.cache.get(message.author.id);

    // Ketika tidak ada di mention
    if (!member)
      return message.reply('tag user yang ingin di :hammer:');

    // Ketika usernamenya sama ama yang di mention
    if (member.user.id === message.author.id)
      return message.reply('Anda tidak bisa membanned diri anda sendiri.');

    // Ketika yang membanned adalah member
    if (!author.hasPermission("BAN_MEMBERS"))
      return message.reply('Anda adalah member biasa, anda tidak bisa menggunakan command ini!');

    // Ketika yang dibanned adalah admin/momod
    if (member.hasPermission("BAN_MEMBERS"))
      return message.reply('Anda tidak bisa membanned staff!');

    member.ban({ reason: reason })
      .then((banMember) => {
        message.reply(`Anda berhasil membanned **${banMember.user.tag}** dengan alasan:\n${reason}`);
      })
      .catch((err) => {
        message.reply(`Sepertinya ada masalah!\n\`\`\`${err.message}\`\`\``);

      });
    //log
    let embed = new MessageEmbed()
      .setColor(client.warna.kato)
      .setAuthor(`BAN | ${member.user.tag}`)
      .addField("User", member, true)
      .addField("Moderator", message.author, true)
      .addField("Alasan", reason)
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
  name: 'ban',
  description: 'memblokir user dari server',
  usage: 'k!ban <user> [reason]',
  example: 'k!ban @juned nakal'
}