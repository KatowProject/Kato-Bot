const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    const attachment = new Discord.Attachment('https://bit.ly/2m1hWPj');
       
     message.channel.send(attachment);
}
module.exports.help = {
    name: "madoka"
  }
