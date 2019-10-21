const Discord = require('discord.js')

module.exports.run = async (bot, message, args) => {

    let embed = new Discord.RichEmbed()
    .setColor(" ")
    .setTitle("Pilih salah satu dari Reaksi tersebut!")
    .addField("`k!kiss` `k!hug` `k!slap` `k!owo` `k!pat` `k!wasted` `k!lick` `k!greet` `k!dance` ")
    message.channe.send(embed)
}
    module.exports.help = {
        name : "reaction"
    }
