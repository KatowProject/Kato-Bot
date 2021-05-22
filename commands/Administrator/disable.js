const Discord = require('discord.js');
const { specificCommands } = require('../../database/schema/manageCommand');

exports.run = async (client, message, args) => {

    try {

        const AR = specificCommands;

        let request = args.join(' ');
        if (!request) return message.reply('Pilih Opsi yang ingin ditentukan `[on / off]`\n**Contoh: k!cmd ping on**');


        let cmd = client.commands.get(args[0]);
        if (!cmd) return message.reply('tidak ditemukan perintahnya!');
        cmd = cmd.help;

        const ARs = await AR.findOne({ guild: message.guild.id });
        if (!ARs) return message.reply('gk ada database-nya');

        const findCMD = ARs.command.find(a => a.name === cmd.name);
        const indexElement = ARs.command.indexOf(findCMD);

        switch (args[1]) {
            case 'off':

                if (!findCMD) {

                    const objCMD = {
                        name: cmd.name,
                        channels: [].concat(message.channel.id)
                    };

                    await AR.findOneAndUpdate({ guild: message.guild.id }, { guild: message.guild.id, command: ARs.command.concat(objCMD) });
                    message.reply(`${cmd.name} telah berhasil dinonaktifkan!`);

                } else {

                    const objCMD = {
                        name: findCMD.name,
                        channels: findCMD.channels.concat(message.channel.id)
                    };

                    if (findCMD.channels.includes(message.channel.id)) return message.reply('Perintah ini sudah pernah dinonaktifkan sebelumnya!');
                    ARs.command[indexElement] = objCMD;

                    await AR.findOneAndUpdate({ guild: message.guild.id }, { guild: message.guild.id, command: ARs.command });
                    message.reply(`${cmd.name} telah berhasil dinonaktifkan!`);

                }


                break;

            case 'on':

                if (!findCMD || findCMD.channels.length < 1) {

                    return message.reply('Perintah ini tidak dinonaktifkan!');

                } else {

                    const filterChannels = findCMD.channels.filter(a => a !== message.channel.id);
                    const objCMD = {
                        name: findCMD.name,
                        channels: filterChannels
                    }

                    ARs.command[indexElement] = objCMD;
                    await AR.findOneAndUpdate({ guild: message.guild.id }, { guild: message.guild.id, command: ARs.command });
                    message.reply(`${cmd.name} telah berhasil diaktifkan kembali`);

                }

                break;

            case 'list':

                const embed = new Discord.MessageEmbed()
                    .setColor(client.warna.kato)
                    .setTitle(`Channel Blacklist | Perintah **${cmd.name}**`)
                    .setDescription(findCMD.channels.map((a, i) => `${i + 1}. <#${a}>`).join('\n') || `~ Tidak ada Channel yang dinonaktifkan! ~`)
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
    permissions: ['MANAGE_CHANNELS']
}

exports.help = {
    name: 'cmd',
    description: 'matiin, nyalain, dan lihat data perintah',
    usage: 'cmd <command> <on/off>',
    example: 'cmd ping off'
}