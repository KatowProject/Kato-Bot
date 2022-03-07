const { Client, Message, MessageEmbed, Permissions, MessageAttachment } = require('discord.js');

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
      return;

    // Ketika usernamenya sama ama yang di mention
    if (member.user.id === message.author.id)
      return message.reply('Anda tidak bisa membanned diri anda sendiri.');

    // Ketika yang membanned adalah member
    if (!author.permissions.has([Permissions.FLAGS.BAN_MEMBERS]))
      return;

    // Ketika yang dibanned adalah admin/momod
    if (member.permissions.has([Permissions.FLAGS.BAN_MEMBERS]))
      return message.reply('Anda tidak bisa membanned staff!');

    const attchments = new MessageAttachment("https://media2.giphy.com/media/H99r2HtnYs492/200.gif");
    member.ban({ reason: reason })
      .then((banMember) => {
        message.reply({ content: `Anda berhasil membanned **${banMember.user.tag}**\nAlasan:\n${reason}`, files: [attchments] });
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

    client.channels.cache.get(client.config.channel["warn-activity"]).send({ embeds: [embed] });
  } catch (error) {
    return message.channel.send(`Something went wrong: ${error.message}`);
    // Restart the bot as usual.
  }
}

exports.conf = {
  aliases: [],
  cooldown: 5,
  permissions: ['BAN_MEMBERS']
}

exports.help = {
  name: 'ban',
  description: 'memblokir user dari server',
  usage: 'k!ban <user> [reason]',
  example: 'k!ban @juned nakal'
}