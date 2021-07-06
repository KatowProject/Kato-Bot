const Discord = require('discord.js');
const db = require('../../database/schema/event');

exports.run = async (client, message, args) => {
    const dataUser = await db.find({});

    const dailyEmbed = new Discord.MessageEmbed().setColor(client.warna.kato).setTitle('Informasi Akun').setAuthor('Perkumpulan Orang Santai', message.guild.iconURL({ size: 4096 }));
    const user = dataUser.find(a => a.userID === message.author.id);
    if (!user) return message.reply('Kamu belum terdaftar dalam event ini!');

    dailyEmbed.addField('Absen', user.isAttend ? 'Telah dilakukan' : 'Belum dilakukan');
    dailyEmbed.addField('Pesan', `${user.message.daily}/100 | ${user.message.daily <= 100 ? 'Belum selesai' : 'Telah selesai'}`);
    dailyEmbed.setFooter('Note: Jumlah pesan update setiap 5 Menit dan pesan akan direset Jam 00.00 WIB');

    dailyEmbed.addField('Ticket', user.ticket);
    message.channel.send(dailyEmbed);
}

exports.conf = {
    aliases: [],
    cooldown: 5
};

exports.help = {
    name: 'info',
    description: 'daily ticket',
    usage: 'daily',
    example: 'daily'
}