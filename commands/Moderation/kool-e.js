const Discord = require('discord.js');

exports.run = async (client, message, args) => {
    try {
        if (!message.member.hasPermission("MUTE_MEMBERS") || !message.guild.owner) return;
        if (!message.guild.me.hasPermission(["MANAGE_ROLES", "ADMINISTRATOR"])) return message.channel.send("Aku tidak mempunyai akses!");

        const mutee = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mutee) return;
        let role = message.guild.roles.cache.find(r => r.name === "Kool-E");


        mutee.roles.add(role).then(() => {
            message.channel.send(`${mutee.user.tag} telah selesai diberi \`Kool-E\`.\nAlasan : Menghina Kato`)
        })

        let embed = new Discord.MessageEmbed()
            .setAuthor(`Kool-E | ${mutee.user.tag}`)
            .setColor(client.warna.kato)
            .addField("User", mutee, true)
            .addField("Moderator", message.author, true)
            .setTimestamp()
            .setFooter(`${message.member.id}`, message.guild.iconURL);

        client.channels.cache.get("795778726930677790").send(embed);

        setTimeout(() => {
            mutee.roles.remove(role)
        }, 900000);

    } catch (error) {
        return message.channel.send(`Something went wrong: ${error.message}`);
        // Restart the bot as usual.
    }



}

exports.conf = {
    aliases: ['koole'],
    cooldown: 5
}

exports.help = {
    name: 'kool-e',
    description: 'Memberikan Role Kool-E kepada Member',
    usage: 'k!koole',
    example: 'k!koole'
}