const Discord = require('discord.js');
const ms = require('ms');
const db = require('quick.db');

exports.run = async (client, message, args) => {
    try {
        if (!message.member.hasPermission("MUTE_MEMBERS") || !message.guild.owner) return;
        if (!message.guild.me.hasPermission(["MANAGE_ROLES", "ADMINISTRATOR"])) return message.channel.send("Aku tidak mempunyai akses!");

        let mutee = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mutee) return;
        let role = message.guild.roles.cache.find(r => r.name === "Muted");

        let timeout = args[1]
        if (!timeout) return message.reply('masukkan durasi terlebih dahulu!')
        let durasi = ms(timeout)

        let reason = args.slice(2).join(' ')
        if (!reason) reason = "tidak diberi alasan";

        mutee.roles.add(role).then(() => {
            message.channel.send(`${mutee.user.tag} telah selesai di mute.\nAlasan : ${reason}`)
        });

        //upload duration to database
        let table = new db.table('UNs');
        await table.set(mutee.id, { dur: durasi, first: Date.now(), guild: message.guild.id });

        let embed = new Discord.MessageEmbed()
            .setAuthor(`MUTE | ${mutee.user.tag}`)
            .setColor(client.warna.kato)
            .addField("User", mutee, true)
            .addField("Moderator", message.author, true)
            .addField('Durasi', client.util.parseDur(durasi))
            .addField("Alasan", reason, true)
            .setTimestamp()
            .setFooter(`${message.member.id}`, message.guild.iconURL);

        client.channels.cache.get("438330646537044013").send(embed);

    } catch (error) {
        return message.channel.send(`Something went wrong: ${error.message}`);
        // Restart the bot as usual.
    }



}

exports.conf = {
    aliases: [],
    cooldown: 5
}

exports.help = {
    name: 'tempbisuw',
    description: 'Memberikan Role Muted kepada Member',
    usage: 'k!bisu <user> [reason]',
    example: 'k!bisu @juned spam'
}