const Discord = require('discord.js');
const dbDonatur = require('../../database/schema/Donatur');

exports.run = async (client, message, args) => {
    try {
        const user = await dbDonatur.findOne({ userID: message.author.id });
        if (!user) return message.reply('Kamu bukan donatur!');
        if (user.isAttend) return message.reply('Kamu sudah absen!');

        await user.update({ ticket: user.ticket + 1, isAttend: true });

        message.reply('Absen telah berhasil!');
    } catch (err) {
        console.log(`Something went wrong: \`\`\`\n${err.message}\`\`\``);
    }
};

exports.conf = {
    aliases: [],
    cooldown: 5,
    location: __filename
}

exports.help = {
    name: 'daily',
    description: 'Mengambil uang harian',
    usage: 'daily',
    example: 'daily'
}