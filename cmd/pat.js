const { RichEmbed } = require("discord.js");
const client = require("nekos.life")
const Discord = require("discord.js")
const { sfw } = new client();

module.exports.run = async (bot, message, args) => {
 let pat = await sfw.pat();
 let member = message.mentions.members.first();
 if (member) {
  let embed = new Discord.RichEmbed()
   .setTitle(`${message.guild.member(message.author).displayName} mengelus ${message.guild.member(member).displayName} ( *︾▽︾)`)
   .setColor("#985ce7")
   .setImage(pat.url);
  
  message.channel.send(embed);
 } else message.reply("Tag seseoarang yang ingin kamu pat!");
    
};
    
module.exports.help = {
 name : "pat"
}

//awoo, bang, banghead, bite, blush, confused, cry, cuddle, dab, dance, deletthis,
 //deredere, discordmeme, foxgirl, greet,
 // handhold, hug, initiald, insult, insultwaifu, jojo, kemonomimi, 
  //kiss, lewd, lick, megumin, nom, owo, pat, poi, poke, pout, punch, rem, shrug, 
  // sleepy, stare, sumfuk, thinking, tickle, trap, triggered, wasted