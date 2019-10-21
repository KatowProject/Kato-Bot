const { RichEmbed } = require("discord.js");
const client = require("nekos.life")
const Discord = require("discord.js")
const { sfw } = new client();

module.exports.run = async (bot, message, args) => {
 let dance = await sfw.dance();
 let member = !args[0];
 if (member) {
  let embed = new Discord.RichEmbed()
   .setTitle(`${message.guild.member(message.author).displayName} Berdansa`)
   .setColor("#985ce7")
   .setImage(dance.url);
  
  message.channel.send(embed);
 } else message.reply("sepertinya terjadi kesalahan");
    
};
    
module.exports.help = {
 name : "dance"
}

//awoo, bang, banghead, bite, blush, confused, cry, cuddle, dab, dance, deletthis,
 //deredere, discordmeme, foxgirl, greet,
 // handhold, hug, initiald, insult, insultwaifu, jojo, kemonomimi, 
  //kiss, lewd, lick, megumin, nom, owo, pat, poi, poke, pout, punch, rem, shrug, 
  // sleepy, stare, sumfuk, thinking, tickle, trap, triggered, wasted
