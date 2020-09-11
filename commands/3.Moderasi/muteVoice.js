const Discord = require('discord.js')

exports.run = async (client, message, args) => {
    try {

        //cek permission pada member dan bot
        if (!message.member.hasPermission('MUTE_MEMBERS') || !message.guild.owner) return;
        if (!guild.me.hasPermission('MUTE_MEMBERS')) return message.reply('Berikan aku akses `MUTE MEMBERS` untuk melajutkan!').then(t => t.delete({ timeout: 5000 }))

        //ini buat data channel
        let channel = message.member.voice.channel;
        // ini buat data authornya
        let author = message.guild.members.cache.get(message.author.id);

        //mari eksekusi
        if (channel) {
            for (let member of channel.members) {
                member[1].voice.setMute(!channel)
            }
            message.channel.send('Berhasil membisukan semua user!')
        } else {
            for (let member of channel.members) {
                member[1].voice.setMute(false)
            }
            message.channel.send('Berhasil melepaskan bisu semua user!')
        }

        //log
        let embed = new Discord.MessageEmbed()
            .setAuthor('MUTE SERVERS', author.avatarURL({ size: 4096, dynamic: true }))
            .addField('Channel', channel.name, true)
            .addField('Moderator', author, true)
        await message.channel.send(embed)


    } catch (err) {
        message.reply(`Sepertinya ada kesalahan \`\`\`\n${err}\`\`\``)
    }
}

exports.conf = {
    aliases: ['mvoice'],
    cooldown: 5
}

exports.help = {
    name: 'bisu-voice',
    description: 'Membisukan Microphone pada member (Server Mute)',
    usage: 'mvoice',
    example: 'mvoice'
}