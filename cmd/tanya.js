const Discord = require("discord.js")

var pepeok = "<:pepeok:593756215725654053>"
var pepebruh = "<:pepebruh:597468775041990657>"
var paansi = "<:paansi:579665763997188096>"
var badman = "<:feelsbadman:583214722548105218>"


module.exports.run = async (bot, message, args) => {
    if(!args[2]) return message.reply("Berikan pertanyaan kepada ku!");
    let balas = ["Ya." , `Tidak ${badman} ` , "Aku tidak mengetahuinya! :triumph:." , `Tanyakan lagi nanti ${pepeok}.` , `Pertanyaan mu gaje ${pepebruh}. ` , `${paansi}.` ];

    let hasil = Math.floor((Math.random() * balas.length));
    let pertanyaan = args.slice(1).join('');

    message.channel.send(balas[hasil])
}
    
    module.exports.help = {
        name : "tanya"
    }
