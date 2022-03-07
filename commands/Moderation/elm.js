const Discord = require('discord.js');
const ELM = require('../../database/schema/ELMs');

exports.run = async (client, message, args) => {
    try {

        if (!message.guild.me.permissions.has("MUTE_MEMBERS")) return message.channel.send("Aku tidak mempunyai akses!");
        if (!message.member.permissions.has("MUTE_MEMBERS")) return message.channel.send("Kamu tidak memiliki izin untuk menggunakan perintah ini!");

        let elm = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
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
        let berimute = message.guild.roles.cache.find(r => r.name === "ELM");
        await elm.roles.add(berimute).then(() => {
            message.delete()
            message.channel.send(`**${elm.user.tag}** telah selesai di ELM.\nAlasan : ${reason}`)
        })

        let embed = new Discord.MessageEmbed()
            .setAuthor(`ELM | ${elm.user.tag}`)
            .setColor('RANDOM')
            .addField("User", `<@${elm.id}>`, true)
            .addField("Moderator", `<@${message.author.id}>`, true)
            .addField("Alasan", reason, true)
            .setTimestamp()
            .setFooter(`${message.member.id}`, message.guild.iconURL);

        client.channels.cache.get(client.config.channel["warn-activity"]).send({ embeds: [embed] });

        message.guild.channels.cache.find(c => c.name === "ruang-bk").send(`Hai **${elm}**, Selamat datang di <#821630026817470485>, member yang hanya bisa melihat channel ini artinya sedang dalam hukuman karena telah melanggar sesuatu. Jika anda merasa pernah melakukan sesuatu yang melanggar rules, silahkan beritahu disini agar segera diproses oleh staff dan dapat melanjukan kembali aktivitas chat secara normal.`);
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