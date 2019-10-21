const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
  let target_userID = message.guild.members.get(args[0]);
  let target_author = !args[0];
  let target_mentions = message.mentions.users.first();
  let target_server = args[0] === "server";

  if (target_server) {
    let embed = new Discord.RichEmbed()
    .setColor("#985ce7")
    .setAuthor(message.guild.name, message.guild.iconURL)
    .setDescription(`[Avatar URL Link](${message.guild.iconURL}?size=2048)`)
    .setImage(`${message.guild.iconURL}?size=2048`)
    message.channel.send(embed);
  };

  if (target_mentions) {
    let embed = new Discord.RichEmbed()
    .setColor("#985ce7")
    .setAuthor(target_mentions.tag, target_mentions.displayAvatarURL)
    .setDescription(`[Avatar URL Link](${target_mentions.displayAvatarURL})`)
    .setImage(target_mentions.displayAvatarURL)
    message.channel.send(embed);
  };

  if (target_userID) {
    let embed = new Discord.RichEmbed()
    .setColor("#985ce7")
    .setAuthor(target_userID.user.tag, target_userID.user.displayAvatarURL)
    .setDescription(`[Avatar URL Link](${target_userID.user.displayAvatarURL})`)
    .setImage(target_userID.user.displayAvatarURL)
    message.channel.send(embed);
  };

  if (target_author) {
    let embed = new Discord.RichEmbed()
    .setColor("#985ce7")
    .setAuthor(message.author.tag, message.author.displayAvatarURL)
    .setDescription(`[Avatar URL Link](${message.author.displayAvatarURL})`)
    .setImage(message.author.displayAvatarURL)
    message.channel.send(embed);
  };

}


module.exports.help = {
    name : "avatar"
}
