const Discord = require('discord.js');
const db = require('../database/schema/eventParticipations');

module.exports = async (client, message) => {
    const findUser = await db.findOne({ userID: message.author.id });
    if (!findUser) message.reply('Kamu belum terdaftar dalam event!');

    const embed = new Discord.MessageEmbed().setColor(client.warna.kato).setTitle('Data Event').setAuthor('Perkumpulan Orang Santai', 'https://cdn.discordapp.com/icons/336336077755252738/2204fd32e2a63da40789044ed3bb179c.png?size=4096');
    embed.addField('Nama: ', findUser.realName);
    embed.addField('Tag: ', `${message.author.tag} | ${message.author.id}`);
    embed.addField('Lagu: ', findUser.songSelection);

    const embedMsg = await message.reply(embed);
    await embedMsg.react('🇳');
    await embedMsg.react('🇸');

    const name = embedMsg.createReactionCollector((reaction, user) => reaction.emoji.name === '🇳');
    const song = embedMsg.createReactionCollector((reaction, user) => reaction.emoji.name === '🇸');

    name.on('collect', async (f) => {
        message.reply('Masukkan nama yang ingin diubah!');
        const names = await message.channel.awaitMessages((m) => m.content.toLowerCase() && m.author.id === message.author.id, {
            max: 1,
            time: 100000,
            errors: ["time"]
        });

        const final = names.first().content;
        await db.findOneAndUpdate({ userID: message.author.id }, { realName: final });
        message.reply('Nama telah berhasil diubah!');
    });

    song.on('collect', async (f) => {
        message.reply('Masukkan lagu yang ingin diubah!');
        const songs = await message.channel.awaitMessages((m) => m.content.toLowerCase() && m.author.id === message.author.id, {
            max: 1,
            time: 100000,
            errors: ["time"]
        });

        const final = songs.first().content;
        await db.findOneAndUpdate({ userID: message.author.id }, { songSelection: final });
        message.reply('Lagu telah berhasil diubah!');
    });

}