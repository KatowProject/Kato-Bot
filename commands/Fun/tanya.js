const Discord = require('discord.js');

var pepeok = "<:pepeok:593756215725654053>"
var pepebruh = "<:pepebruh:597468775041990657>"
var paansi = "<:paansi:579665763997188096>"
var badman = "<:feelsbadman:583214722548105218>"

exports.run = async (client, message, args) => {
  try {
    if(!args[0]) return message.reply("Berikan pertanyaan kepada ku!");

    let balas = ["Ya." , `Tidak ${badman} ` ,
                 "Aku tidak mengetahuinya! :triumph:." ,
                 `Tanyakan lagi nanti ${pepeok}.` ,
                 `Aku tidak mengerti pertanyaan mu 😕. ` ,
                 `${paansi}.` ,
                 `tentu saja!` ];

    let hasil = Math.floor((Math.random() * balas.length));
    let pertanyaan = args.slice(1).join('');

    message.channel.send(balas[hasil])
    } catch (error) {
      return message.channel.send(`Something went wrong: ${error.message}`);
      // Restart the bot as usual.
    }
}

exports.conf = {
  aliases: ["ask"],
  cooldown: 5
}

exports.help = {
  name: 'tanya',
  description: 'tanyakan sesuatu kepada kato!',
  usage: 'k!tanya [apa yang ingin ditanyakan]',
  example: 'k!tanya apakah kato cantik?'
}