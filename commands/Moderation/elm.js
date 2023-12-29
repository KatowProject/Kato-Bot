const { Client, Message, EmbedBuilder } = require('discord.js');
const ELM = require('../../database/schemas/Elm');

/**
 * @param {Client} client
 * @param {Message} message
 * @param {[]} args
 */

exports.run = async (client, message, args) => {
    try {

        if (!message.guild.members.me.permissions.has('MuteMembers')) return message.channel.send("Aku tidak mempunyai akses!");
        if (!message.member.permissions.has('MuteMembers')) return message.channel.send("Kamu tidak memiliki izin untuk menggunakan perintah ini!");

        const elm = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!elm) return;

        let reason = args.slice(1).join(" ");
        if (!reason) reason = "tidak ada alasan";

        //simpen data
        const guildMember = await ELM.findOne({ userID: elm.id });
        if (!guildMember) {
            await ELM.create({ guild: message.guild.id, userID: elm.id, roles: elm._roles })
        } else {
            return message.reply('User udah kena elm!');
        }

        //copot role
        for (const role of elm._roles) {
            elm.roles.remove(role);
        }

        //pasang role
        const berimute = message.guild.roles.cache.find(r => r.name === "ELM");
        await elm.roles.add(berimute).then(() => {
            message.delete()
            message.channel.send(`**${elm.user.tag}** telah selesai di ELM.\nAlasan : ${reason}`)
        })

        const embed = new EmbedBuilder()
            .setAuthor({ name: `ELM | ${elm.user.tag}`, iconURL: elm.user.displayAvatarURL() })
            .setColor('Random')
            .addFields(
                { name: 'User', value: `<@${elm.id}>`, inline: true },
                { name: 'Moderator', value: `<@${message.author.id}>`, inline: true },
                { name: 'Alasan', value: reason, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `${message.member.id}`, iconURL: message.guild.iconURL() });

        client.channels.cache.get(process.env.CHANNEL_MESSAGE_WARN).send({ embeds: [embed] });

        message.guild.channels.cache.find(c => c.name === "ruang-bk").send(`Hai **${elm}**, Selamat datang di <#932997960923480100>, member yang hanya bisa melihat channel ini artinya sedang dalam hukuman karena telah melanggar sesuatu. Jika anda merasa pernah melakukan sesuatu yang melanggar rules, silahkan beritahu disini agar segera diproses oleh staff dan dapat melanjukan kembali aktivitas chat secara normal.`);
    } catch (error) {
        return message.channel.send(`Something went wrong: ${error.message}`);
        // Restart the bot as usual.
    }
}

exports.conf = {
    aliases: ["jail", "kurung"],
    cooldown: 5,
    permissions: ['MUTE_MEMBERS']
}

exports.help = {
    name: 'elm',
    description: 'memberikan role ELM kepada user',
    usage: 'k!elm <user> [alasan]',
    example: 'k!elm @juned'
}