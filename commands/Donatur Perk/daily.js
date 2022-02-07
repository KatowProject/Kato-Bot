const Discord = require('discord.js');
const dbDonatur = require('../../database/schema/Donatur');
const dbBooster = require('../../database/schema/Booster');

exports.run = async (client, message, args) => {
    try {
        let user;
        let opt;
        const roles = message.member.roles.cache;
        if (roles.hasAll('932997958788608044', '933117751264964609')) {
            user = await dbDonatur.findOne({ userID: message.author.id });
            opt = 1;
        } else if (roles.has('932997958788608044')) {
            user = await dbDonatur.findOne({ userID: message.author.id });
            opt = 1;
        } else if (roles.has('933117751264964609')) {
            user = await dbBooster.findOne({ userID: message.author.id });
            opt = 2;
        } else {
            return message.reply('Kamu bukan partisipan!');
        }

        if (!user) return message.reply('Kamu bukan donatur!');
        if (user.isAttend) return message.reply('Kamu sudah absen!');
        switch (opt) {
            case 1:
                await dbDonatur.findOneAndUpdate({ userID: message.author.id }, { ticket: (user.ticket ? user.ticket : 0) + 1, isAttend: true });
                break;
            case 2:
                await dbBooster.findOneAndUpdate({ userID: message.author.id }, { ticket: (user.ticket ? user.ticket : 0) + 1, isAttend: true });
                break;
        }
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