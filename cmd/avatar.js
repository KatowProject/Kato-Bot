const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
  let target_userID = message.guild.members.get(args[0]);
  let target_author = !args[0];
  let target_mentions = message.mentions.users.first();
  let target_server = args[0] === "server";
  
  const embed = new Discord.RichEmbed()
     .setColor("#985ce7")
  
  if (target_server) {
    embed.setAuthor(message.guild.name, message.guild.iconURL)
    embed.setDescription(`[Avatar URL Link](${message.guild.iconURL}?size=2048)`)
    embed.setImage(`${message.guild.iconURL}?size=2048`)
    message.channel.send(embed);
  };

  if (target_mentions) {
    embed.setAuthor(target_mentions.tag, target_mentions.displayAvatarURL)
    embed.setDescription(`[Avatar URL Link](${target_mentions.displayAvatarURL})`)
    embed.setImage(target_mentions.displayAvatarURL)
    message.channel.send(embed);
  };

  if (target_userID) {
    embed.setAuthor(target_userID.user.tag, target_userID.user.displayAvatarURL)
    embed.setDescription(`[Avatar URL Link](${target_userID.user.displayAvatarURL})`)
    embed.setImage(target_userID.user.displayAvatarURL)
    message.channel.send(embed);
  };

  if (target_author) {
    embed.setAuthor(message.author.tag, message.author.displayAvatarURL)
    embed.setDescription(`[Avatar URL Link](${message.author.displayAvatarURL})`)
    embed.setImage(message.author.displayAvatarURL)
    message.channel.send(embed);
  };
}


module.exports.help = {
    name : "avatar"
}
