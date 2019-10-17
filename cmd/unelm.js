const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {


if (!message.member.hasPermissions(["MANAGE_ROLES", "KICK_MEMBERS"]) || !message.guild.owner) return message.channel.send('Kamu tidak Mempunyai Akses!');
if (!message.guild.me.hasPermissions(["MANAGE_ROLES", "ADMINISTRATOR"])) return message.channel.send("Aku tidak mempunyai akses!");

let korban = message.mentions.members.first() || message.guild.members.get(args[0]);
if(!korban) return message.channel.send("tag user yang ingin di unelm!");


let copotsantai = message.guild.roles.find(r => r.name === "Santai");
korban.addRole(copotsantai.id) 

let copotNSFW = message.guild.roles.find(r => r.name === "NSFW");
korban.addRole(copotNSFW.id) 

let berimute = message.guild.roles.find(r => r.name === "ELM");

korban.removeRole(berimute.id).then(() => {
    message.delete()
    
    message.channel.send(`${korban.user.username} telah selesai di unelm.`)
})

let embed = new Discord.RichEmbed()
.setTitle(`UNELM | ${korban.user.username}#${korban.user.discriminator}`)
.setColor("#RANDOM")
.addField("User", korban , true)
.addField("Moderator", message.author, true)
.setTimestamp()
.setFooter(`${message.member.id}`, message.guild.iconURL);


  let channel = message.guild.channels.find(c => c.name === "warn-activity");
  if (!channel) return message.reply("Please create a incidents channel first!");
  channel.send(embed);

}

module.exports.help = {
    name : "unelm"
}