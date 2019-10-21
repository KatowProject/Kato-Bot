const { RichEmbed } = require("discord.js");
const client = require("nekos.life")
const Discord = require("discord.js")
const { sfw } = new client();

module.exports.run = async (bot, message, args) => {
 let hug = await sfw.hug();
 let member = message.mentions.members.first();
 if (member) {
  let embed = new Discord.RichEmbed()
   .setTitle(`${message.guild.member(message.author).displayName} memeluk ${message.guild.member(member).displayName} (✿◡‿◡)`)
   .setColor("#985ce7")
   .setImage(hug.url);
  
  message.channel.send(embed);
 } else message.reply("Tag seseoarang yang ingin kamu peluk!");
    
};
    
module.exports.help = {
 name : "hug"
}

//awoo, bang, banghead, bite, blush, confused, cry, cuddle, dab, dance, deletthis,
 //deredere, discordmeme, foxgirl, greet,
 // handhold, hug, initiald, insult, insultwaifu, jojo, kemonomimi, 
  //kiss, lewd, lick, megumin, nom, owo, pat, poi, poke, pout, punch, rem, shrug, 
  // sleepy, stare, sumfuk, thinking, tickle, trap, triggered, wasted