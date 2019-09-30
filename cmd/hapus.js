const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    if(!message.member.hasPermissions("MANAGE_MESSAGES")) return message.reply("Kato takbisa menghapus pesan yang kauinginkan. Maaf, ya ...")
    if(!args[0]) return message.channel.send(" Tidak bisa menghapus pesan yang kau inginkan!")
    message.channel.bulkDelete(args[0]).then(() => {
        message.channel.send(`:ok_hand: ${args[0]} Pesan telah terhapus!`).then(message => message.delete(5000));
    });
}

module.exports.help = {
    name : "prune"
}
