const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {


if (!message.member.hasPermissions(["MANAGE_ROLES", "KICK_MEMBERS"]) || !message.guild.owner) return message.channel.send('Kamu tidak Mempunyai Akses!');
if (!message.guild.me.hasPermissions(["MANAGE_ROLES", "ADMINISTRATOR"])) return message.channel.send("Aku tidak mempunyai akses!");

let mutee = message.mentions.members.first() || message.guild.members.get(args[0]);
if(!mutee) return message.channel.send("tag user yang ingin di elm!");

let reason = args.slice(1).join(" ");
if(!reason) reason = "-";

let copotsantai = message.guild.roles.find(r => r.name === "Santai");
mutee.removeRole(copotsantai.id) 

let copotNSFW = message.guild.roles.find(r => r.name === "NSFW");
mutee.removeRole(copotNSFW.id) 

let berimute = message.guild.roles.find(r => r.name === "ELM");

mutee.addRole(berimute.id).then(() => {
    message.delete()
    mutee.send(`kamu telah di ELM dengan alasan ${reason}`)
    message.channel.send(`${mutee.user.username} telah selesai di ELM.`)
})

let embed = new Discord.RichEmbed()
.setTitle(`ELM | ${mutee.user.username}#${mutee.user.discriminator}`)
.setColor("#985ce7")
.addField("User", mutee , true)
.addField("Moderator", message.author, true)
.addField("Alasan", reason, true)
.setTimestamp()
.setFooter(`${message.member.id}`, message.guild.iconURL);


  let channel = client.channels.get("438330646537044013");
  if (!channel) return message.reply("Please create a incidents channel first!");
  channel.send(embed);

  
}

module.exports.help = {
    name : "elm"
}
