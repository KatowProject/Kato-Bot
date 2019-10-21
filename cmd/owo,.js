const { RichEmbed } = require("discord.js");
const client = require("nekos.life")
const Discord = require("discord.js")
const { sfw } = new client();

module.exports.run = async (bot, message, args) => {
 let owo = await sfw.owo();
 let member = !args[0];
 if (member) {
  let embed = new Discord.RichEmbed()
   .setTitle(`OwO`)
   .setColor("#985ce7")
   .setImage(owo.url);
  
  message.channel.send(embed);
 } else message.reply("sepertinya terjadi kesalahan");
    
};
    
module.exports.help = {
 name : "owo"
}

//awoo, bang, banghead, bite, blush, confused, cry, cuddle, dab, dance, deletthis,
 //deredere, discordmeme, foxgirl, greet,
 // handhold, hug, initiald, insult, insultwaifu, jojo, kemonomimi, 
  //kiss, lewd, lick, megumin, nom, owo, pat, poi, poke, pout, punch, rem, shrug, 
  // sleepy, stare, sumfuk, thinking, tickle, trap, triggered, wasted
