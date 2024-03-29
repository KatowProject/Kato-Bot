const { Client, Message } = require('discord.js');

/**
 * @param {Client} client
 * @param {Message} message
 * @param {[]} args
 */

exports.run = async (client, message, args) => {
    try {
        if (!message.member.permissions.has('ManageMessages')) return;

        if (!args[0]) return message.channel.send(" Tidak bisa menghapus pesan yang kau inginkan!");
        message.delete();
        message.channel.bulkDelete(args[0]).then(() => {
            message.channel.send(`:ok_hand: ${args[0]} Pesan telah terhapus!`).then(msg => setTimeout(() => msg.delete(), 5000));
        });

    } catch (error) {
        return message.channel.send(`Something went wrong: ${error.message}`);
        // Restart the bot as usual.
    }
}

exports.conf = {
    aliases: ["hapus"],
    cooldown: 5,
    permissions: ['MANAGE_MESSAGES'],
    location: __filename
}

exports.help = {
    name: 'prune',
    description: 'Menghapus sebuah pesan',
    usage: 'k!prune <jumlah pesan>',
    example: 'k!prune 10'
}