const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

    const attachment = new Discord.Attachment('https://image.prntscr.com/image/1MLtCWG0QAmI-ouhaEJXDA.png');
       
 message.channel.send(attachment);
}

module.exports.help = {
    name: "tindas"
  }

  
