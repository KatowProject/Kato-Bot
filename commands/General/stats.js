const Discord = require("discord.js");
const { version } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
let os = require('os')
let cpuStat = require("cpu-stat");

exports.run = async (client, message, args) => {

  try {
    let cpuLol;
    cpuStat.usagePercent(function (err, percent) {
      if (err) {
        return console.log(err);
      }

      const duration = moment.duration(client.uptime).format(" D [Days], H [Hours], m [Minutes], s [Seconds]");

      var djs_icon = "<\:discordjs:592136964531290112>";
      var njs_icon = "<\:node:592137881091309571>";

      const embed = new Discord.MessageEmbed()
        .setAuthor(`${client.user.username}\'s Statistics`, "https://cdn.discordapp.com/emojis/559740262520455169.png?v=1")
        .setThumbnail(`${client.user.displayAvatarURL()}`)
        .setDescription(`${djs_icon}  **Discord.js (v${version})**\n${njs_icon}  **Node.js (${process.version})**`)
        .addField("❯ Memory Usage", `\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(0)} / 10240 MB\` used`, true)
        .addField("❯ CPU Usage", `\`${percent.toFixed(0)} %\``, true)
        .addField("❯ Platform", `\`${os.type}\``, true)
        .addField("❯ Uptime", `\`${duration}\``, true)
        .addField("❯ Ping", `API : \`${Math.floor(client.ws.ping)}ms\`\nLatency : \`${message.createdTimestamp} ms\``, true)
        .addField("❯ Client", `Server: \`${client.guilds.cache.size} Joined\`\nChannels: \`${client.channels.cache.size} Channels\`\nUsers: \`${client.users.cache.size} Users\``, true)
        .setFooter(`⌨ ${client.user.username} 2020`)
        .setColor("RANDOM")
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