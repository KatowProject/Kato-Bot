const Discord = require('discord.js');
const db = require('../../database').log;

const { Client, Message, MessageEmbed } = require('discord.js')
/**
 * @param {Client} client
 * @param {Message} message
 * @param {[]} args
 */

exports.run = async (client, message, args) => {

    const guildData = db.get(message.guild.id);

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

        // Ketika yang dibanned adalah admin/momod
        if (member.hasPermission("KICK_MEMBERS"))
            return message.reply('Anda tidak bisa membanned staff!');

        member.kick({ reason: reason })
            .then(kickMember => {
                message.reply(`Anda berhasil menendang **${kickMember.user.tag}** dengan alasan:\n${reason}`);
            })
            .catch(err => {
                message.reply(`Sepertinya ada masalah!\n\`\`\`${err.message}\`\`\``);
            });

        const embed = new MessageEmbed()
            .setAuthor(`KICK | ${member.user.tag}`)
            .setColor(client.warna.kato)
            .addField("User", member, true)
            .addField("Moderator", message.author, true)
            .addField("Alasan", reason, true)
            .setTimestamp()
            .setFooter(`${message.member.id}`, message.guild.iconURL())

        const getChannel = guildData.kick;
        if (guildData === 'null') return message.reply('Untuk mengaktifkan Log silahkan ketik k!logs').then(msg => msg.delete({ timeout: 5000 }));
        client.channels.cache.get(getChannel).send(embed);

    } catch (error) {
        return message.channel.send(`Something went wrong: ${error.message}`);
        // Restart the bot as usual.
    }
}

exports.conf = {
    aliases: ["tendang"],
    cooldown: 5,
    permissions: ['KICK_MEMBERS']
}

exports.help = {
    name: 'kick',
    description: 'Menendang user dari server',
    usage: 'k!kick <user> [reason]',
    example: 'k!kick @juned badung'
}