const Discord = require('discord.js');
const neko = require('nekos.life')
const { nsfw } = new neko()
const JSZip = require('jszip')

exports.run = async (client, message, args) => {
  try {
    var zip = new JSZip();

    var photoZip = zip.folder("photos");
    // this call will create photos/README
    photoZip.file("README", "a folder with photos");

    /*
    Results in a zip containing
    Hello.txt
    images/
        smile.gif
    */
  } catch (error) {
    return message.channel.send(`Something went wrong: ${error.message}`);
    // Restart the bot as usual.
  }
}

exports.conf = {
  aliases: [],
  cooldown: 5
}

exports.help = {
  name: 'base',
  description: '',
  usage: '',
  example: ''
}