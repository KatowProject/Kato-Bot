const Discord = require('discord.js');
const AR = require('../../database/schema/autoResponse');

exports.run = async (client, message, args) => {

    try {

        //get author n ar data
        const listAR = await AR.findOne({ guild: message.guild.id });

        //send to user
        const embed = new Discord.MessageEmbed()
            .setColor(client.warna.kato)
            .setAuthor('List Autorespond:', message.guild.iconURL({ size: 2048, dynamic: true }))
            .setDescription(listAR.data.map((a, i) => `**${i + 1}.** ${a.name}`))
            .setFooter('jika ada list yang bernama `undefined` segera hapus dengan command removear!')
        const msg_embed = await message.channel.send(embed);
        const msg_alert = await message.reply('Pilih yang ingin dihapus! `Gunakan Masukkan Nilai angka untuk menghapusnya!`');

        //request to user
        const request = await message.channel.awaitMessages((m) => m.content.toLowerCase() && m.author.id === message.author.id, {
            max: 1,
            time: 60000,
            errors: ["time"]
        }).catch((err) => {
            return message.reply('Waktu permintaan telah habis, silahkan buat permintaan kembali!').then(async t => {
                t.delete({ timeout: 5000 });
                await msg_embed.delete();
                await msg_alert.delete();
            });
        });

        //delete data
        await msg_embed.delete();
        await msg_alert.delete();

        const requestContent = parseInt(request.first().content);
        const filterAR = listAR.data.filter(a => a !== listAR.data[requestContent - 1]);
        if (filterAR.length === listAR.data.length) return message.reply('Permintaan tidak dapat dimengerti, silahkan buat permintaan kembali!');

        await AR.findOneAndUpdate({ guild: message.guild.id }, { guild: message.guild.id, data: filterAR });
        message.reply('telah berhasil dihapus dari database!');

    } catch (error) {
        return message.reply('sepertinya ada kesalahan:\n' + error.message);
        // Restart the bot as usual.
    }
}

exports.conf = {
    aliases: [],
    cooldown: 5,
    permissions: ['ADMINISTRATOR']
}

exports.help = {
    name: 'removear',
    description: '',
    usage: '',
    example: ''
}