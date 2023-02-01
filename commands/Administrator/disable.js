const { Client, Message, EmbedBuilder } = require('discord.js');

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {[]} args 
 */
exports.run = async (client, message, args) => {
    const db = client.db.cmd;
    try {
        const request = args.join(' ');
        if (!request) return message.reply('Pilih Opsi yang ingin ditentukan `[on / off]`\n**Contoh: k!cmd ping on**');

        const cmd = client.commands.get(args[0])?.help;
        if (!cmd) return message.reply('tidak ditemukan perintahnya!');

        const data = await db.get(`${message.guild.id}`);
        if (!data) data = await db.set(`${message.guild.id}`, { all: [], cmd: [] });

        const cmds = data.cmd;
        let getcmd = cmds.find(a => a.name === cmd.name);
        if (!getcmd) cmds.push({ name: cmd.name, channel: [] }) ? getcmd = cmds.find(a => a.name === cmd.name) : getcmd = null;

        switch (args[1]) {
            case 'off':
                if (getcmd.channel.includes(message.channel.id)) return message.reply('perintah ini sudah dinonaktifkan!');
                getcmd.channel.push(message.channel.id);

                message.reply('perintah ini telah dinonaktifkan!');
                await db.set(`${message.guild.id}`, data);
                break;

            case 'on':
                if (!getcmd.channel.includes(message.channel.id)) return message.reply('Perintah ini tidak dinonaktifkan!');
                getcmd.channel = getcmd.channel.filter(a => a !== message.channel.id);

                message.reply('perintah ini telah diaktifkan!');
                await db.set(`${message.guild.id}`, data);
                break;

            case 'list':
                const embed = new EmbedBuilder()
                    .setColor('Random')
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
}

exports.help = {
    name: 'cmd',
    description: 'matiin, nyalain, dan lihat data perintah',
    usage: 'cmd <command> <on/off>',
    example: 'cmd ping off'
}