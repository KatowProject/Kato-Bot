const Discord = require('discord.js');
const { Permissions } = Discord;
const ms = require('ms');

exports.run = async (client, message, args) => {
    try {
        if (!message.guild.me.permissions.has([Permissions.FLAGS.BAN_MEMBERS])) return message.channel.send("Aku tidak mempunyai akses!");
        if (!message.member.permissions.has([Permissions.FLAGS.BAN_MEMBERS])) return message.channel.send("Kamu tidak memiliki izin untuk menggunakan perintah ini!");

        let mutee = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mutee) return;

        let timeout = args[1];
        if (!timeout) return message.reply('masukkan durasi terlebih dahulu!');
        let durasi = ms(timeout);
        if (!durasi) return message.reply('masukkan durasi yang benar!');
        if (durasi > 2419200000) return message.reply('durasi tidak boleh lebih dari 28 hari!');

        let reason = args.slice(2).join(' ');
        if (!reason) reason = "tidak diberi alasan";

        mutee.timeout(durasi, reason).then(() => {
            message.channel.send(`${mutee.user.tag} telah di mute selama ${timeout}!`);
        });

        let embed = new Discord.MessageEmbed()
            .setAuthor(`MUTE | ${mutee.user.tag}`)
            .setColor("RANDOM")
            .addField("User", `<@${mutee.id}>`, true)
            .addField("Moderator", `<@${message.author}>`, true)
            .addField('Durasi', client.util.parseDur(durasi))
            .addField("Alasan", reason, true)
            .setTimestamp()
            .setFooter(`${message.member.id}`, message.guild.iconURL);

        client.channels.cache.get(client.config.channel["warn-activity"]).send(embed);

    } catch (error) {
        return message.channel.send(`Something went wrong: ${error.message}`);
        // Restart the bot as usual.
    }
}

exports.conf = {
    aliases: [],
    cooldown: 5,
    permissions: ['MUTE_MEMBERS']
}

exports.help = {
    name: 'tempbisu',
    description: 'Memberikan Role Muted kepada Member',
    usage: 'k!bisu <user> [reason]',
    example: 'k!bisu @juned spam'
}