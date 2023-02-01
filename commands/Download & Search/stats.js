const { Client, Message, EmbedBuilder } = require("discord.js");
const { version } = require("discord.js");
const moment = require("moment");
const os = require('os')
const cpuStat = require("cpu-stat");

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {[]} args 
 * @returns 
 */
exports.run = async (client, message, args) => {

    try {
        cpuStat.usagePercent(function (err, percent) {
            if (err) return console.log(err);
            const uptime = moment.duration(client.uptime);
            const duration = `${uptime.days()} days, ${uptime.hours()} hours, ${uptime.minutes()} minutes, ${uptime.seconds()} seconds`

            const djs_icon = "<\:discordjs:592136964531290112>";
            const njs_icon = "<\:node:592137881091309571>";

            const embed = new EmbedBuilder()
                .setAuthor({ name: `${client.user.username}\'s Statistics`, iconURL: "https://cdn.discordapp.com/emojis/559740262520455169.png?v=1" })
                .setThumbnail(`${client.user.displayAvatarURL()}`)
                .setDescription(`${djs_icon}  **Discord.js (v${version})**\n${njs_icon}  **Node.js (${process.version})**`)
                .addFields(
                    { name: "❯ Memory Usage", value: `\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(0)} / ${(os.totalmem() / 1024 / 1024).toFixed(0)} MB\``, inline: true },
                    { name: "❯ CPU Usage", value: `\`${percent.toFixed(0)} %\``, inline: true },
                    { name: "❯ Platform", value: `\`${os.type}\``, inline: true },
                    { name: "❯ Uptime", value: `\`${duration}\``, inline: true },
                    { name: "❯ Ping", value: `API : \`${Math.floor(client.ws.ping)}ms\`\nLatency : \`${message.createdTimestamp - Date.now()} ms\``, inline: true },
                    { name: "❯ Client", value: `Server: \`${client.guilds.cache.size} Joined\`\nChannels: \`${client.channels.cache.size} Channels\`\nUsers: \`${client.users.cache.size} Users\``, inline: true }
                )
                .setFooter({ text: `⌨ ${client.user.username} | ${moment().get('year')}`, iconURL: client.user.displayAvatarURL() })
                .setColor('Random')
                .setTimestamp()
            message.channel.send({ embeds: [embed] });

        });
    } catch (error) {
        return message.channel.send(`Something went wrong: ${error.message}`);
        // Restart the bot as usual.
    }
}

exports.conf = {
    aliases: ["spec"],
    cooldown: 5
}

exports.help = {
    name: 'stats',
    description: 'Melihat spesifikasi PC yang dipakai oleh Kato-Bot',
    usage: 'k!stats',
    example: 'k!stats'
}