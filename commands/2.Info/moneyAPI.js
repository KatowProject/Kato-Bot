const Discord = require('discord.js');
const axios = require('axios');

exports.run = async (client, message, args) => {
    let api = await axios.get('https://api.exchangeratesapi.io/latest?base=USD'); api = api.data;

    let embed = new Discord.MessageEmbed()
        .setColor(client.warna.kato)
        .setAuthor('Currency', 'https://i.gifer.com/ZgRn.gif', 'https://api.exchangeratesapi.io/')
        .setTitle('Base Currency US$1')
        .addField('IDR', 'Rp' + api.rates.IDR, true)
        .addField('JPY', '¥' + api.rates.JPY, true)
        .addField('EUR', '€' + api.rates.EUR, true)
        .addField('CNY', '¥' + api.rates.CNY, true)
        .addField('HKD', 'HK$' + api.rates.HKD, true)
        .addField('SGD', 'SG$' + api.rates.SGD, true)
        .setFooter('Date: ' + api.date)

    message.channel.send(embed);
}

exports.conf = {
    aliases: [],
    cooldown: 5
};

exports.help = {
    name: 'money',
    description: 'currency',
    usage: 'money',
    example: 'money'
};