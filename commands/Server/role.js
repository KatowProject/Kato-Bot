const Discord = require('discord.js');

exports.run = async (client, message, args) => {
    try {
        const embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setAuthor(message.guild.name, message.guild.iconURL())
            .setDescription(`Klik tombol <:santai:933134928818896906> untuk melanjutkan!`)

        const button = new Discord.MessageActionRow()
            .addComponents([
                new Discord.MessageButton().setEmoji('<:santai:933134928818896906>').setStyle('PRIMARY').setCustomId(`santai`)
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