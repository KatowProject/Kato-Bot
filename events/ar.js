const {MessageEmbed , Attachment} = require('discord.js')
module.exports = (client, message) => {
let pedo = new MessageEmbed()
.setColor('#985ce7')
.setImage("https://cdn.discordapp.com/attachments/519859252966457369/641765228987809802/FB_IMG_1571834909693.png")
if (message.content.toLowerCase() === 'pedo') { 
      message.channel.send(pedo);
  } 
  else
{
let ngaca = new MessageEmbed()
.setColor('#985ce7')
.setImage("https://media.discordapp.net/attachments/447408276628307969/714442765311803472/Screenshot_2020-05-25-18-40-09-59.png")
if (message.content.toLowerCase() === 'ngaca') {
  message.channel.send(ngaca)
} 
else 
{
  let user = "<@!578144365009043466>"
  let ping = new MessageEmbed()
  .setColor('#985ce7')
  .setImage('https://cdn.discordapp.com/attachments/519859252966457369/702365347721773116/kato_ping.gif')
  if(message.content.toLowerCase() === user) {
    message.channel.send(ping)
  }
else
{
  let user = "<@578144365009043466>"
  let ping = new MessageEmbed()
  .setColor('#985ce7')
  .setImage('https://cdn.discordapp.com/attachments/519859252966457369/702365347721773116/kato_ping.gif')
  if(message.content.toLowerCase() === user) {
    message.channel.send(ping)
} 
else
{
  let ping = new MessageEmbed()
  .setColor('#985ce7')
  .setImage('https://cdn.discordapp.com/attachments/519859252966457369/702365347721773116/kato_ping.gif')
  if(message.content.toLowerCase() === "@everyone") {
    message.channel.send(ping)
  }
}
  } 

}
  };

};
