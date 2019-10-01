const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    const attachment = new Discord.Attachment('https://cdn.discordapp.com/attachments/447408276628307969/623823526717161473/haveyourpraisedthenameofoursaviourgoddessmadokatoday.png');
       
     message.channel.send(attachment);
}
module.exports.help = {
    name: "madoka"
  }
  
