const { ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

exports.run = async (client, message, args) => {
    try {
        const embed = new EmbedBuilder()
            .setColor('Random')
            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ forceStatic: true, size: 4096 }) })
            .setDescription(`Klik tombol <:santai:1061950814316417054> untuk melanjutkan!`)

        const button = new ActionRowBuilder()
            .addComponents([
                new ButtonBuilder().setEmoji('<:santai:1061950814316417054>').setStyle(ButtonStyle.Primary).setCustomId(`santai`)
            ]);

        message.channel.send({ embeds: [embed], components: [button] });
    } catch (err) {
        message.channel.send(err.message);
    }
};

exports.conf = {
    aliases: [],
    cooldown: 5,
    location: __filename
}

exports.help = {
    name: 'role',
    description: 'Menampilkan daftar role yang tersedia',
    usage: 'role',
    example: 'role'
}