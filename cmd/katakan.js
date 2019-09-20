const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    const sayMessage = args.join(" ")
    message.delete().catch(O_o=>{}) 
    message.channel.send(sayMessage, { disableEveryone: true})
}

module.exports.help = {
    name : "p"
}