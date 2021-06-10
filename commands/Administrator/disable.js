const Discord = require('discord.js');
const db = require('../../database').cmd;

exports.run = async (client, message, args) => {

    try {

        let request = args.join(' ');
        if (!request) return message.reply('Pilih Opsi yang ingin ditentukan `[on / off]`\n**Contoh: k!cmd ping on**');


        let cmd = client.commands.get(args[0]);
        if (!cmd) return message.reply('tidak ditemukan perintahnya!');
        cmd = cmd.help;

        let data = db.get(cmd.name);

        switch (args[1]) {
            case 'off':

                if (data === null) {
                    db.set(cmd.name, [message.channel.id]);
                } else {
                    db.push(cmd.name, message.channel.id)
                }

                message.reply(`${cmd.name} telah berhasil dinonaktifkan!`);

                break;

            case 'on':

                let filterData = data.filter(ID => ID !== message.channel.id);
                db.set(cmd.name, filterData);
                message.reply(`${cmd.name} telah berhasil diaktifkan kembali`);

                break;

            case 'list':

                if (data === null) return message.reply(`tidak ada channel yang dinonaktifkan!`);

                let embed = new Discord.MessageEmbed()
                    .setColor(client.warna.kato)
                    .setTitle(`Channel Blacklist | Perintah **${cmd.name}**`)
                    .setDescription(data.map((a, i) => `${i + 1}. <#${a}>`).join('\n') || `~ Tidak ada Channel yang dinonaktifkan! ~`)
                message.channel.send(embed);

                break;

            default:
                message.reply('pilih opsinya!');
                break;
        }


    } catch (error) {
        return message.reply('sepertinya ada kesalahan:\n' + error.message);
        // Restart the bot as usual.
    }
}

exports.conf = {
    aliases: [],
    cooldown: 5,
    permission: ['MANAGE_CHANNELS']
}

exports.help = {
    name: 'cmd',
    description: 'matiin, nyalain, dan lihat data perintah',
    usage: 'cmd <command> <on/off>',
    example: 'cmd ping off'
}