const { Client, Message, EmbedBuilder } = require('discord.js');

/**
 * @param {Client} client
 * @param {Message} message
 * @param {[]} args
 */

exports.run = async (client, message, args) => {
    try {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const reason = args.slice(1).join(" ") || "Tidak ada alasan";
        const author = message.guild.members.cache.get(message.author.id);

        // Ketika tidak ada di mention
        if (!member)
            return;

        // Ketika usernamenya sama ama yang di mention
        if (member.user.id === message.author.id)
            return message.reply('Anda tidak bisa membanned diri anda sendiri.');

        // Ketika yang membanned adalah member
        if (!author.permissions.has('KickMembers'))
            return;

        // Ketika yang dibanned adalah admin/momod
        if (member.permissions.has('KickMembers'))
            return message.reply('Anda tidak bisa membanned staff!');

        member.kick({ reason: reason })
            .then(kickMember => {
                message.reply(`Anda berhasil menendang **${kickMember.user.tag}** dengan alasan:\n${reason}`);
            })
            .catch(err => {
                message.reply(`Sepertinya ada masalah!\n\`\`\`${err.message}\`\`\``);
            });
        const embed = new EmbedBuilder()
            .setAuthor({ name: `KICK | ${member.user.tag}`, iconURL: member.user.displayAvatarURL() })
            .setColor('Random')
            .addFields(
                { name: 'User', value: `<@${member.id}>`, inline: true },
                { name: 'Moderator', value: `<@${message.author.id}>`, inline: true },
                { name: 'Alasan', value: reason, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `${message.member.id}`, iconURL: message.guild.iconURL() })

        client.channels.cache.get(process.env.CHANNEL_MESSAGE_WARN).send({ embeds: [embed] });
    } catch (error) {
        return message.channel.send(`Something went wrong: ${error.message}`);
        // Restart the bot as usual.
    }
}

exports.conf = {
    aliases: ["tendang"],
    cooldown: 5,
    permissions: ['KICK_MEMBERS'],
    location: __filename
}

exports.help = {
    name: 'kick',
    description: 'Menendang user dari server',
    usage: 'k!kick <user> [reason]',
    example: 'k!kick @juned badung'
}