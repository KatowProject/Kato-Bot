const { Client, Message, EmbedBuilder } = require('discord.js');
const ms = require('ms');

/**
 * @param {Client} client
 * @param {Message} message
 * @param {[]} args
 */

exports.run = async (client, message, args) => {
    try {
        if (!message.guild.members.me.permissions.has('MuteMembers')) return message.channel.send("Aku tidak mempunyai akses!");
        if (!message.member.permissions.has('MuteMembers')) return message.channel.send("Kamu tidak memiliki izin untuk menggunakan perintah ini!");

        const mutee = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mutee) return;

        const timeout = args[1];
        if (!timeout) return message.reply('masukkan durasi terlebih dahulu!');
        const durasi = ms(timeout);
        if (!durasi) return message.reply('masukkan durasi yang benar!');
        if (durasi > 2419200000) return message.reply('durasi tidak boleh lebih dari 28 hari!');

        const reason = args.slice(2).join(' ') || "tidak diberi alasan";
        mutee.timeout(durasi, reason).then(() => {
            message.channel.send(`${mutee.user.tag} telah di mute selama ${timeout}!`);
        });

        const embed = new EmbedBuilder()
            .setAuthor({ name: `MUTE | ${mutee.user.tag}`, iconURL: mutee.user.displayAvatarURL() })
            .setColor('Random')
            .addFields(
                { name: 'User', value: `<@${mutee.id}>`, inline: true },
                { name: 'Moderator', value: `<@${message.author.id}>`, inline: true },
                { name: 'Durasi', value: client.util.parseDur(durasi), inline: true },
                { name: 'Alasan', value: reason, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `ID: ${message.member.id}`, iconURL: message.guild.iconURL() });

        client.channels.cache.get(client.config.channel["warn-activity"]).send(embed);

    } catch (error) {
        return message.channel.send(`Something went wrong: ${error.message}`);
        // Restart the bot as usual.
    }
}

exports.conf = {
    aliases: [],
    cooldown: 5,
    permissions: ['MUTE_MEMBERS'],
    location: __filename
}

exports.help = {
    name: 'tempbisu',
    description: 'Memberikan Role Muted kepada Member',
    usage: 'k!bisu <user> [reason]',
    example: 'k!bisu @juned spam'
}