const Discord = require('discord.js');
const axios = require('axios');

exports.run = async (client, message, args) => {
    let api = await axios.get('https://api.exchangeratesapi.io/latest?base=USD'); api = api.data;

    if (args[0] === undefined) args[0] = 1;
    let embed = new Discord.MessageEmbed()
        .setColor(client.warna.kato)
        .setAuthor('Currency', 'https://i.gifer.com/ZgRn.gif', 'https://api.exchangeratesapi.io/')
        .setTitle(`Base Currency US$${args[0] ?? 1}`)
        .addField('IDR', 'Rp' + (api.rates.IDR * args[0]).toFixed(2), true)
        .addField('JPY', '¥' + (api.rates.JPY * args[0]).toFixed(2), true)
        .addField('EUR', '€' + (api.rates.EUR * args[0]).toFixed(2), true)
        .addField('CNY', '¥' + (api.rates.CNY * args[0]).toFixed(2), true)
        .addField('HKD', 'HK$' + (api.rates.HKD * args[0]).toFixed(2), true)
        .addField('SGD', 'SG$' + (api.rates.SGD * args[0]).toFixed(2), true)
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