const Discord = require("discord.js");
const { Client, Message, RichEmbed } = require('discord.js');

/**
 * @param {Client} client
 * @param {Message} message
 * @param {[]} args
 */
module.exports.run = async (client, message, args) => {
    let member = message.mentions.members.first();
    let reason = args.slice(1).join(" ") || "Tidak ada alasan";
    let author = message.guild.members.get(message.author.id);

    // Ketika tidak ada di mention
    if (!member)
        return message.reply('tag user yang ingin di :hammer:');

    // Ketika usernamenya sama ama yang di mention
    if (member.user.id === message.author.id)
        return message.reply('Anda tidak bisa membanned diri anda sendiri.');

    // Ketika yang membanned adalah member
    if (!author.hasPermission("ADMINISTRATOR") || !author.hasPermission("MANAGE_GUILD"))
        return message.reply('Anda adalah member biasa, anda tidak bisa menggunakan command ini!');

    // Ketika yang dibanned adalah admin/momod
    if (member.hasPermission("ADMINISTRATOR") || member.hasPermission("MANAGE_GUILD"))
        return message.reply('Anda tidak bisa membanned staff!');

    member.ban({ reason: reason })
        .then((banMember) => {
            message.reply(`Anda berhasil membanned **${banMember.user.username}#${banMember.user.discriminator}** dengan alasan:\n${reason}`);
        })
        .catch((err) => {
            message.reply(`Sepertinya ada masalah!\n\`\`\`${err.message}\`\`\``);
    
    });
    //log
    let embed = new Discord.RichEmbed()
      .setColor("#985ce70")
      .setTitle(`BAN | ${member.user.username}#${member.user.discriminator}`)
      .addField("User", member, true)
      .addField("Moderator", message.author, true)
      .addField("Alasan", reason)
      .setTimestamp()
      .setFooter(`${message.member.id}`, message.guild.iconURL)

    let channel = message.guild.channels.find(c => c.name === "warn-activity");
  if (!channel) return message.reply("Please create a incidents channel first!");
  return message.channel.send(embed);
}



module.exports.help = {
    name: "ban"
}
