const Discord = require('discord.js');
const db = require('../../database').cmd;

exports.run = async (client, message, args) => {
    try {
        const request = args.join(' ');
        if (!request) return message.reply('Pilih Opsi yang ingin ditentukan `[on / off]`\n**Contoh: k!cmd ping on**');

        const cmd = client.commands.get(args[0])?.help;
        if (!cmd) return message.reply('tidak ditemukan perintahnya!');

        let data = db.get(`${message.guild.id}`);
        if (!data) data = db.set(`${message.guild.id}`, { all: [], cmd: [] });

        const cmds = data.cmd;
        let getcmd = cmds.find(a => a.name === cmd.name);
        if (!getcmd) cmds.push({ name: cmd.name, channel: [] }) ? getcmd = cmds.find(a => a.name === cmd.name) : getcmd = null;

        switch (args[1]) {
            case 'off':
                if (getcmd.channel.includes(message.channel.id)) return message.reply('perintah ini sudah dinonaktifkan!');
                getcmd.channel.push(message.channel.id);

                message.reply('perintah ini telah dinonaktifkan!');
                db.set(`${message.guild.id}`, data);
                break;

            case 'on':
                if (!getcmd.channel.includes(message.channel.id)) return message.reply('Perintah ini tidak dinonaktifkan!');
                getcmd.channel = getcmd.channel.filter(a => a !== message.channel.id);

                message.reply('perintah ini telah diaktifkan!');
                db.set(`${message.guild.id}`, data);
                break;

            case 'list':
                const embed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(`Perintah yang dinonaktifkan di ${message.guild.name}`)
                    .setDescription(getcmd.channel.map((a, i) => `${i + 1}. <#${a}>`).join('\n') || 'Tidak ada perintah yang dinonaktifkan!');

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
    permission: ['MANAGE_CHANNELS']
}

exports.help = {
    name: 'cmd',
    description: 'matiin, nyalain, dan lihat data perintah',
    usage: 'cmd <command> <on/off>',
    example: 'cmd ping off'
}