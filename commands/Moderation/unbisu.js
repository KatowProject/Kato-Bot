const { Client, Message, EmbedBuilder } = require('discord.js');

/**
 * @param {Client} client
 * @param {Message} message
 * @param {[]} args
 */

exports.run = async (client, message, args) => {
    try {
        if (!message.guild.members.me.permissions.has("MUTE_MEMBERS")) return message.channel.send("Aku tidak mempunyai akses!");
        if (!message.member.permissions.has("MUTE_MEMBERS")) return message.channel.send("Kamu tidak memiliki izin untuk menggunakan perintah ini!");

        if (args[0] === 'voice') {
            const channel = message.member.voice.channel;
            for (const member of channel.members) {
                member[1].voice.setMute(false)
            };
            message.channel.send('Telah dinonaktifkan!');
        } else {
            const mutee = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            if (!mutee) return;

            mutee.timeout(null).then(() => {
                message.channel.send(`${mutee.user.tag} telah diunmute!`);
            });

            const embed = new EmbedBuilder()
                .setAuthor({ name: `UNMUTE | ${mutee.user.tag}`, iconURL: mutee.user.displayAvatarURL() })
                .setColor('Random')
                .addFields(
                    { name: 'User', value: `<@${mutee.id}>`, inline: true },
                    { name: 'Moderator', value: `<@${message.author.id}>`, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: `${message.member.id}`, iconURL: message.guild.iconURL() });

            client.channels.cache.get(process.env.CHANNEL_MESSAGE_WARN).send({ embeds: [embed] });
        }
    } catch (error) {
        return message.channel.send(`Something went wrong: ${error.message}`);
        // Restart the bot as usual.
    }
}

exports.conf = {
    aliases: [],
    cooldown: 5,
    location: __filename
}

exports.help = {
    name: 'unbisu',
    description: 'Melepaskan Role Muted',
    usage: 'k!unbisu <user/id>',
    example: 'k!unbisu @juned'
}