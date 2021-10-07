const Discord = require('discord.js');
const db = require('../../database/schema/event');

exports.run = async (client, message, args) => {
    const dataUser = await db.find({});

    const dailyEmbed = new Discord.MessageEmbed().setColor(client.warna.kato).setTitle('Informasi Akun').setAuthor('Perkumpulan Orang Santai', message.guild.iconURL({ size: 4096 }));
    const user = dataUser.find(a => a.userID === message.author.id);
    if (!user) return message.reply('Kamu belum terdaftar dalam event ini!');

    dailyEmbed.addField('Absen', user.isAttend ? 'Telah dilakukan' : 'Belum dilakukan');
    dailyEmbed.addField('Pesan', `${user.message.daily}/50 | ${user.message.daily < 50 ? 'Belum selesai' : 'Telah selesai'}`);
    dailyEmbed.addField('Ticket', user.ticket);
    if (user.items.length < 1) {
        dailyEmbed.addField('Items', 'Tidak ada')
    } else {
        const items = user.items.map((a, i) => {
            const isPending = a.isPending ? 'Pending' : a.used ? 'Sudah digunakan' : 'Ready';
            return `**${i + 1}.** ${a.name} | ${isPending}`;
        });
        dailyEmbed.addField('Items', items.join('\n'));
    }
    dailyEmbed.setFooter('Note:\n1. Jumlah pesan update setiap 5 Menit dan pesan akan direset Jam 00.00 WIB\n2. Jika ingin mengklaim hadiah jalankan perintah k#use');
    message.channel.send(dailyEmbed);
}

exports.conf = {
    aliases: ['inv'],
    cooldown: 5
};

exports.help = {
    name: 'info',
    description: 'daily ticket',
    usage: 'daily',
    example: 'daily'
}