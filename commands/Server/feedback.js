const { EmbedBuilder } = require('discord.js');

exports.run = async (client, message, args) => {
    const isi = args.join(' ');
    if (isi.length <= 10) return message.reply('Setidaknya berisi lebih dari 10 karakter');

    const embed = new EmbedBuilder()
        .setColor('Random')
        .setAuthor({ name: message.guild.name, text: message.guild.iconURL() })
        .setDescription(`**Isi Masukan:**\n${isi}`)
        .setFooter({ text: `Dikirim oleh ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
    const getChannel = client.channels.cache.get('932997959388385394');
    if (!getChannel) return message.reply('Kato tidak dapat mengirim saran dikarenakan Channel belum terbuat, silahkan lapor ke Staff!');
    getChannel.send({ embeds: [embed] });

    message.reply('Masukan telah terkirim, Terima Kasih!');
};

exports.conf = {
    aliases: [],
    cooldown: 5,
    location: __filename
}

exports.help = {
    name: 'feedback',
    description: 'memberi masukan',
    usage: 'feedback <masukan>',
    example: 'feedback saya tidak bisa mengirim pesan'
}