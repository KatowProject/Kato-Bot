const { Client, Message, EmbedBuilder, Permissions, AttachmentBuilder } = require('discord.js');

/**
 * @param {Client} client
 * @param {Message} message
 * @param {[]} args
 */
exports.run = async (client, message, args) => {

    try {

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let reason = args.slice(1).join(" ") || "Tidak ada alasan";
        let author = message.guild.members.cache.get(message.author.id);

        // Ketika tidak ada di mention
        if (!member)
            return;

        // Ketika usernamenya sama ama yang di mention
        if (member.user.id === message.author.id)
            return message.reply('Anda tidak bisa membanned diri anda sendiri.');

        // Ketika yang membanned adalah member
        if (!author.permissions.has('BanMembers'))
            return;

        // Ketika yang dibanned adalah admin/momod
        if (member.permissions.has('BanMembers'))
            return message.reply('Anda tidak bisa membanned staff!');

        const attchments = new AttachmentBuilder("https://media2.giphy.com/media/H99r2HtnYs492/200.gif");
        member.ban({ reason: reason })
            .then((banMember) => {
                message.reply({ content: `Anda berhasil membanned **${banMember.user.tag}**\nAlasan:\n${reason}`, files: [attchments] });
            })
            .catch((err) => {
                message.reply(`Sepertinya ada masalah!\n\`\`\`${err.message}\`\`\``);

            });
        //log
        const embed = new EmbedBuilder()
            .setColor('Random')
            .setAuthor({ name: `BAN | ${member.user.tag}`, iconURL: member.user.displayAvatarURL() })
            .addFields(
                { name: 'User', value: `<@${member.id}>`, inline: true },
                { name: 'Moderator', value: `<@${message.author.id}>`, inline: true },
                { name: 'Alasan', value: reason }
            )
            .setTimestamp()
            .setFooter({ text: `${message.member.id}`, iconURL: message.guild.iconURL() });

        client.channels.cache.get(process.env.CHANNEL_MESSAGE_WARN).send({ embeds: [embed] });
    } catch (error) {
        return message.channel.send(`Something went wrong: ${error.message}`);
        // Restart the bot as usual.
    }
}

exports.conf = {
    aliases: [],
    cooldown: 5,
    permissions: ['BAN_MEMBERS'],
    location: __filename
}

exports.help = {
    name: 'ban',
    description: 'memblokir user dari server',
    usage: 'k!ban <user> [reason]',
    example: 'k!ban @juned nakal'
}