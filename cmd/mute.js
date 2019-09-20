const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {


if (!message.member.hasPermissions(["MANAGE_ROLES", "KICK_MEMBERS"]) || !message.guild.owner) return message.channel.send('Kamu tidak Mempunyai Akses!');
if (!message.guild.me.hasPermissions(["MANAGE_ROLES", "ADMINISTRATOR"])) return message.channel.send("Aku tidak mempunyai akses!");

let mutee = message.mentions.members.first() || message.guild.members.get(args[0]);
if(!mutee) return message.channel.send("Tag user yang ingin di muted!");

let reason = args.slice(1).join(" ");
if(!reason) reason = "tidak diberi alasan";

let muterole = message.guild.roles.find(r => r.name === "Muted");

mutee.addRole(muterole.id).then(() => {
    message.delete()
    mutee.send(`kamu telah dimute ${message.guild.name} dengan: ${reason}`)
    message.channel.send(`${mutee.user.username} telah selesai di mute.`)
})

let embed = new Discord.RichEmbed()
.setTitle(`Mute | ${mutee.user.username}#${mutee.user.discriminator}`)
.setColor("#RANDOM")
.addField("User", mutee , true)
.addField("Moderator", message.author, true)
.addField("Alasan", reason, true)
.addField("Durasi", "Unknown" , true)
.setTimestamp()
.setFooter(`${message.member.id}`, message.guild.iconURL);


  let channel = message.guild.channels.find(c => c.name === "warn-activity");
  if (!channel) return message.reply("Please create a incidents channel first!");
  channel.send(embed);
}

module.exports.help = {
    name : "bisu"
}