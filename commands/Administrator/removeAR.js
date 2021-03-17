const Discord = require('discord.js');
const db = require('quick.db');

exports.run = async (client, message, args) => {

    try {
        //verify
        if (!message.member.hasPermission('ADMINISTRATOR')) return;
        //get author n ar data
        let req = message.author;
        let list = new db.table('ARs');
        let data = list.all();
        if (data.length < 1) return message.reply('tidak ada autorespond yang terdaftar!');

        //send to user
        let embed = new Discord.MessageEmbed()
            .setColor(client.warna.kato)
            .setAuthor('List Autorespond:', message.guild.iconURL({ size: 2048, dynamic: true }))
            .setDescription(data.map((a, i) => `**${i + 1}.** \`${JSON.parse(a.data).name}\` **[ID: ${a.ID}]**`).join('\n'))
            .setFooter('jika ada list yang bernama `undefined` segera hapus dengan command removear!')
        let msg_embed = await message.channel.send(embed);
        let msg_alert = await message.reply('Pilih yang ingin dihapus! `Gunakan Masukkan Nilai ID untuk menghapusnya!`');

        //request to user
        let request = await message.channel.awaitMessages((m) => m.content.toLowerCase() && m.author.id === req.id, {
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
        let remove = list.delete(request.first().content.toLowerCase());
        if (remove === true) {
            message.channel.send('Ar telah terhapus!').then(t => t.delete({ timeout: 5000 }));
        } else {
            message.channel.send('Tidak ada yang dihapus, silahkan membuat permintaan kembali!').then(t => t.delete({ timeout: 5000 }));
        }

    } catch (error) {
        return message.reply('sepertinya ada kesalahan')
        // Restart the bot as usual.
    }
}

exports.conf = {
    aliases: [],
    cooldown: 5
}

exports.help = {
    name: 'removear',
    description: '',
    usage: '',
    example: ''
}