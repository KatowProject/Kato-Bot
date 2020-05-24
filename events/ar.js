const {MessageEmbed , Attachment} = require('discord.js')
module.exports = (client, message) => {
let pedo = new MessageEmbed()
.setColor('#985ce7')
.setImage("https://archaes.github.io/assets/img/pedo.png")
if (message.content.toLowerCase() === 'pedo') { 
      message.channel.send(pedo);
  } 
  else
{
let ngaca = new MessageEmbed()
.setColor('#985ce7')
.setImage("https://archaes.github.io/assets/img/ngaca.png")
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