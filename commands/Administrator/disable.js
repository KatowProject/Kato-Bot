const Discord = require('discord.js');
const { specificCommands } = require('../../database/schema/manageCommand');

exports.run = async (client, message, args) => {
    try {
        let request = args.join(' ');
        if (!request) return message.reply('Pilih Opsi yang ingin ditentukan `[on / off]`\n**Contoh: k!cmd ping on**');

        let cmd = client.commands.get(args[0])?.help;
        if (!cmd) return message.reply('tidak ditemukan perintahnya!');

        const getData = await specificCommands.findOne({ guild: message.guild.id });
        if (!getData) return message.reply("Data tidak ditemukan!");

        const findCMD = getData.command.find(a => a.name === cmd.name);
        const indexElement = getData.command.indexOf(findCMD);

        switch (args[1]) {
            case 'off':
                if (!findCMD) {
                    const objCMD = {
                        name: cmd.name,
                        channels: [message.channel.id]
                    };

                    await specificCommands.findOneAndUpdate({ guild: message.guild.id }, { guild: message.guild.id, command: getData.command.concat(objCMD) });
                    message.reply(`${cmd.name} telah berhasil dinonaktifkan!`);
                } else {
                    const objCMD = {
                        name: findCMD.name,
                        channels: findCMD.channels.concat(message.channel.id)
                    };

                    if (findCMD.channels.includes(message.channel.id)) return message.reply('Perintah ini sudah pernah dinonaktifkan sebelumnya!');
                    getData.command[indexElement] = objCMD;

                    await specificCommands.findOneAndUpdate({ guild: message.guild.id }, { guild: message.guild.id, command: getData.command });
                    message.reply(`${cmd.name} telah berhasil dinonaktifkan!`);
                }
                break;

            case 'on':
                if (!findCMD || findCMD.channels.length < 1) return message.reply('Perintah ini tidak dinonaktifkan!');

                const filterChannels = findCMD.channels.filter(a => a !== message.channel.id);
                const objCMD = {
                    name: findCMD.name,
                    channels: filterChannels
                }

                getData.command[indexElement] = objCMD;
                await specificCommands.findOneAndUpdate({ guild: message.guild.id }, { guild: message.guild.id, command: getData.command });
                message.reply(`${cmd.name} telah berhasil diaktifkan kembali`);

                break;

            case 'list':
                const embed = new Discord.MessageEmbed()
                    .setColor("RANDOM")
                    .setTitle(`Channel Blacklist | Perintah **${cmd.name}**`)
                    .setDescription(findCMD.channels.map((a, i) => `${i + 1}. <#${a}>`).join('\n') || `~ Tidak ada Channel yang dinonaktifkan! ~`)
                message.channel.send({ embeds: [embed] });
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
    location: __filename,
    permissions: ['MANAGE_CHANNELS'],
}

exports.help = {
    name: 'cmd',
    description: 'matiin, nyalain, dan lihat data perintah',
    usage: 'cmd <command> <on/off>',
    example: 'cmd ping off'
}