const Discord = require("discord.js")
module.exports.run = async (bot, message, args) => {

  if (!message.member.hasPermission("KICK_MEMBERS")  && message.author.id !== "291221132256870400") return message.channel.send("Sorry, you don't have permissions to use this!");
    
  let xdemb = new Discord.RichEmbed()
  .setColor("#00ff00")
  .setTitle("Perintah Kick")
  .addField("Description:", `Menendang Sebuah User/Member`, true)
  .addField("Penggunaan:", "k.kick [user] [reason]", true)
  .addField("Contoh:" ,"k.kick @juned spam")

    let member = message.mentions.members.first();
    if(!member) return message.channel.send(xdemb)
      
    if(!member.kickable) 
      return message.channel.send("Aku tak Bisa Melawannya!");
    
    let reason = args.slice(1).join(' ');
    if(!reason) {
      res = "Tidak Ada Alasan";
    }
    else {
      res = `${reason}`
    }
    
    await member.kick(reason)
      .catch(error => message.reply(`Oh tidak, kato tidak bisa mendendangnya karena of : ${error}`));

      let embed = new Discord.RichEmbed()
      .setColor("#00ff00")
      .setTitle(`Kick | ${member.user.tag}`)
      .addField("User", member, true)
      .addField("Moderator", message.author, true)
      .addField("Alasan", res)
      .setTimestamp()
      .setFooter(`${message.member.id}`, message.guild.iconURL)

      let channel = message.guild.channels.find(c => c.name === "warn-activity");
  if (!channel) return message.reply("Please create a incidents channel first!");
  channel.send(embed);

    message.delete();
    
}
      module.exports.help = {
        name: "kick"
      }