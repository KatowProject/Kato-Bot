const Discord = require('discord.js');
const dbser = require('../../database/schema/event');

exports.run = async (client, message, args) => {
    try {
        const user = await dbser.findOne({ userID: message.author.id });
        if (!user) return message.reply('Kamu tidak terdaftar dalam event ini!');

        if (user.isAttend) return message.reply('Kamu sudah absen!');
        await dbser.findOneAndUpdate({ userID: message.author.id }, { ticket: user.ticket + 1, isAttend: true });
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