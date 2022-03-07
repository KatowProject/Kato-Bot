const { Permissions } = require('discord.js');

exports.run = async (client, message, args) => {
  try {
    let member = args[0];
    let author = message.guild.members.cache.get(message.author.id);

    // Ketika tidak ada ID
    if (!member)
      return message.reply('Kamu tidak mencantumkan IDnya!');

    // Ketika yang mengunban adalah member
    if (!author.permissions.has(Permissions.FLAGS.BAN_MEMBERS))
      return message.reply('Kamu adalah member biasa, Kamu tidak bisa menggunakan command ini!');

    message.guild.members.unban(member)
      .then(k => {
        message.reply(`Anda berhasil melepas banned dari **${member}**!`);
      })
      .catch(err => {
        message.reply(`Sepertinya ada masalah!\n\`\`\`${err.message}\`\`\``);
      });

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
  name: 'unban',
  description: 'mengurungkan blokir pada user di server',
  usage: 'k!unban <userID>',
  example: 'k!unban '
}