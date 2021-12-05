const Discord = require('discord.js');
const ms = require('ms');
const mutees = require('../../database/schema/MuteMembers');

exports.run = async (client, message, args) => {
    try {

        if (!message.guild.me.permissions.has("MANAGE_ROLES")) return message.channel.send("Aku tidak mempunyai akses!");

        let mutee = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mutee) return;
        let role = message.guild.roles.cache.find(r => r.name === "Muted");

        let timeout = args[1];
        if (!timeout) return message.reply('masukkan durasi terlebih dahulu!');
        let durasi = ms(timeout);

        let reason = args.slice(2).join(' ');
        if (!reason) reason = "tidak diberi alasan";

        mutee.roles.add(role).then(() => {
            message.channel.send(`${mutee.user.tag} telah selesai di mute.\nAlasan : ${reason}`);
        });

        const _mute = await mutees.findOne({ userID: mutee.id });
        if (_mute) {
            await mutees.findOneAndUpdate({ userID: mutee.id, guild: message.guild.id, duration: durasi, now: Date.now() });
        } else {
            await mutees.create({ userID: mutee.id, guild: message.guild.id, duration: durasi, now: Date.now() });
        }

        let embed = new Discord.MessageEmbed()
            .setAuthor(`MUTE | ${mutee.user.tag}`)
            .setColor(client.warna.kato)
            .addField("User", `<@${mutee.id}>`, true)
            .addField("Moderator", `<@${message.author}>`, true)
            .addField('Durasi', client.util.parseDur(durasi))
            .addField("Alasan", reason, true)
            .setTimestamp()
            .setFooter(`${message.member.id}`, message.guild.iconURL);

        client.channels.cache.get("795778726930677790").send(embed);

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