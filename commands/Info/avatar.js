const Discord = require('discord.js');

exports.run = async (client, message, args) => {
  let target_userID = message.guild.members.cache.get(args[0]);
  let target_author = !args[0];
  let target_mentions = message.mentions.users.first();
  let target_server = args[0] === "server";
  try {
    if (target_server) {
        let embed = new Discord.MessageEmbed()
        .setColor("#985ce7")
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setDescription(`[Avatar URL Link](${message.guild.iconURL({size : 2048, dynamic : true})})`)
        .setImage(`${message.guild.iconURL({size : 2048, dynamic : true})}`)
        message.channel.send(embed);
      }
    else
      if (target_mentions) {
        let embed = new Discord.MessageEmbed()
        .setColor("#985ce7")
        .setAuthor(target_mentions.tag, target_mentions.displayAvatarURL())
        .setDescription(`[Avatar URL Link](${target_mentions.displayAvatarURL({size : 2048, dynamic : true})})`)
        .setImage(target_mentions.displayAvatarURL({size : 2048, dynamic : true}))
        message.channel.send(embed);
      }
    else
      if (target_userID) {
        let embed = new Discord.MessageEmbed()
        .setColor("#985ce7")
        .setAuthor(target_userID.user.tag, target_userID.user.displayAvatarURL())
        .setDescription(`[Avatar URL Link](${target_userID.user.displayAvatarURL({size : 2048, dynamic : true})})`)
        .setImage(target_userID.user.displayAvatarURL({size : 2048, dynamic : true}))
        message.channel.send(embed);
      }
    else
      if (target_author) {
        let embed = new Discord.MessageEmbed()
        .setColor("#985ce7")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setDescription(`[Avatar URL Link](${message.author.displayAvatarURL({size : 2048, dynamic : true})})`)
        .setImage(message.author.displayAvatarURL({size : 2048, dynamic : true}))

        message.channel.send(embed)
      }
    } catch (error) {
      return message.channel.send(`Something went wrong: ${error.message}`);
      // Restart the bot as usual.
    }
}

exports.conf = {
  aliases: ["profile"],
  cooldown: 5
}

exports.help = {
  name: 'avatar',
  description: 'melihat avatar user',
  usage: 'k!avatar [mention/userid/server]',
  example: 'k!avatar @juned | k!avatar 458342161474387999 | k!avatar server'
}