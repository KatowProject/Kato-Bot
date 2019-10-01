const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
const attachment = new Discord.Attachment('https://cdn.discordapp.com/attachments/519859252966457369/598524411095810048/hanura_copy.jpg');
       
     message.channel.send(attachment);
}

module.exports.help = {
    name: "hanura"
  }
