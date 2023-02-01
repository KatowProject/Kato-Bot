const { Client, Message, EmbedBuilder } = require('discord.js');
const moment = require('moment');

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {[]} args 
 */
exports.run = async (client, message, args) => {
    try {
        const user = message.mentions.users.first() || message.member || message.guild.members.cache.get(args[0])

        if (user.presence.status === "dnd") user.presence.status = "Do Not Disturb";
        if (user.presence.status === "idle") user.presence.status = "Idle";
        if (user.presence.status === "offline") user.presence.status = "Offline";
        if (user.presence.status === "online") user.presence.status = "Online";

        function game() {
            let status = null;
            const type = ["PLAYING", "STREAMING", "LISTENING", "WATCHING", "CUSTOM_STATUS", "COMPETING"];
            const activityType = type[user.presence.activities[0].type];
            if (user.presence.activities.length >= 1) status = `${activityType} ${user.presence.activities[0].name}`;
            else if (user.presence.activities.length < 1) status = "None";
            return status;
        }

        const joinedAt = user.joinedAt;
        const createdAt = user.user.createdAt;
        const x = Date.now() - createdAt;
        const y = Date.now() - joinedAt;
        const created = Math.floor(x / 86400000);
        const joined = Math.floor(y / 86400000);

        let nickname = user.nickname ? user.nickname : "None";
        let createdate = moment.utc(createdAt).format("dddd, MMMM Do YYYY, HH:mm:ss");
        let joindate = moment.utc(joinedAt).format("dddd, MMMM Do YYYY, HH:mm:ss");
        let status = user.presence.status;
        const avatar = user.displayAvatarURL({ forceStatic: true, size: 4096 })

        const embed = new EmbedBuilder()
            .setAuthor({ name: user.user.tag, iconURL: avatar })
            .setThumbnail(message.guild.iconURL({ forceStatic: true, size: 4096 }))
            .setTimestamp()
            .setColor('Random')
            .addFields(
                { name: 'ID', value: user.id, inline: true },
                { name: 'Nickname', value: nickname, inline: true },
                { name: 'Created Account Date', value: `${createdate} \nsince ${created} day(s) ago`, inline: true },
                { name: 'Joined Guild Date', value: `${joindate} \nsince ${joined} day(s) ago`, inline: true },
                { name: 'Status', value: status, inline: true },
                { name: 'Game', value: game(), inline: true }
            )

        message.channel.send({ embeds: [embed] });
    } catch (err) {
        console.log(err)
    }
}

exports.conf = {
    aliases: ["user"],
    cooldown: 5
}

exports.help = {
    name: 'userinfo',
    description: 'Menampilkan informasi sebuah pengguna.',
    usage: 'userinfo [@user]',
    example: 'userinfo @anime'
}