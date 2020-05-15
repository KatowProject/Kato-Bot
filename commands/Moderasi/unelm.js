const Discord = require('discord.js');

exports.run = async (client, message, args) => {
  try {
    if (!message.member.hasPermission("MUTE_MEMBERS") || !message.guild.owner) return message.channel.send('Kamu tidak Mempunyai Akses!');
    if (!message.guild.me.hasPermission(["MANAGE_ROLES", "ADMINISTRATOR"])) return message.channel.send("Aku tidak mempunyai akses!");
    
    let korban = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!korban) return message.channel.send("tag user yang ingin di unelm!");
    
    
    let psantai = message.guild.roles.cache.get("647778783314837507");
    korban.roles.add(psantai) 
    
    let ELM = message.guild.roles.cache.get("505004825621168128");
    
    korban.roles.remove(ELM).then(() => {
        message.delete()
        
        message.channel.send(`**${korban.user.username}#${korban.user.discriminator}** telah selesai di unelm.`)
    })
    
    let embed = new Discord.MessageEmbed()
    .setAuthor(`UNELM | ${korban.user.tag}`)
    .setColor("#985ce7")
    .addField("User", korban , true)
    .addField("Moderator", message.author, true)
    .setTimestamp()
    .setFooter(`${message.member.id}`, message.guild.iconURL)
    
    client.channels.cache.get("438330646537044013").send(embed);
    } catch (error) {
      return message.channel.send(`Something went wrong: ${error.message}`);
      // Restart the bot as usual.
    }
}

exports.conf = {
  aliases: ["bebas"],
  cooldown: 5
}

exports.help = {
  name: 'unelm',
  description: 'melepaskan role ELM',
  usage: 'k!unelm <user>',
  example: 'k!unelm @juned'
}