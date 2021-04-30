const Discord = require('discord.js');

exports.run = async (client, message, args) => {
  try {
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("aku takbisa menghapus pesan yang kauinginkan. Maaf, ya ...")
    if (!args[0]) return message.channel.send(" Tidak bisa menghapus pesan yang kau inginkan!")
    message.delete
    message.channel.bulkDelete(args[0]).then(() => {
      message.channel.send(`:ok_hand: ${args[0]} Pesan telah terhapus!`).then(message => message.delete({ timeout: 5000 }));
    });

  } catch (error) {
    return message.channel.send(`Something went wrong: ${error.message}`);
    // Restart the bot as usual.
  }
}

exports.conf = {
  aliases: ["hapus"],
  cooldown: 5
}

exports.help = {
  name: 'prune',
  description: 'Menghapus sebuah pesan',
  usage: 'k!prune <jumlah pesan>',
  example: 'k!prune 10'
}