const Discord = require("discord.js");
const { version } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
let os = require('os')
let cpuStat = require("cpu-stat");

module.exports.run = async (client, message, args) => {

let cpuLol;
cpuStat.usagePercent(function(err, percent, seconds) {
  if (err) {
    return console.log(err);
  }

const duration = moment.duration(client.uptime).format(" D [Days], H [Hours], m [Minutes], s [Seconds]");

var djs_icon = "<\:discordjs:592136964531290112>";
var njs_icon = "<\:node:592137881091309571>";

const embed = new Discord.RichEmbed()
  .setAuthor(`${client.user.username}\'s Statistics`, "https://cdn.discordapp.com/emojis/559740262520455169.png?v=1")
  .setThumbnail(`${client.user.displayAvatarURL}`)
  .setDescription(`${djs_icon}  **Discord.js (v${version})**\n${njs_icon}  **Node.js (${process.version})**`)
  .addField("❯ Memory Usage", `\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(0)} / 10240 MB\` used`, true)
  .addField("❯ CPU Usage", `\`${percent.toFixed(0)} %\``, true)
  .addField("❯ Platform", "\`Windows Server 2016\`", true)
  .addField("❯ Uptime", `\`${duration}\``, true)
  .addField("❯ Ping", `API : \`${(client.ping).toFixed(0)} ms\`\nLatency : \`${(Date.now() - message.createdTimestamp).toFixed(0)} ms\``, true)
  .addField("❯ Client", `Server: \`${client.guilds.size.toLocaleString()} Joined\`\nChannels: \`${client.channels.size.toLocaleString()} Channels\`\nUsers: \`${client.users.size.toLocaleString()} Users\``, true)
  .setFooter(`⌨ ${client.user.username} 2019`)
  .setColor("RANDOM")
  .setTimestamp()
message.channel.send(embed);

});

}

module.exports.help = {
  name: "stats"
}