const Discord = require('discord.js');
const { add } = require('lodash');
const db = require('quick.db');

exports.run = async (client, message, args) => {

    try {
        //verify
        if (!message.member.hasPermission('ADMINISTRATOR')) return;
        //get data | array
        let list = new db.table('ARs').all();
        if (list.length < 1) return message.reply('tidak ada autorespond yang terdaftar!');

        //send to user
        let embed = new Discord.MessageEmbed()
            .setColor(client.warna.kato)
            .setAuthor('List Autorespond:', message.guild.iconURL({ size: 2048, dynamic: true }))
            .setDescription(list.map((a, i) => `${i + 1}. ${JSON.parse(a.data).name} [ID: ${a.ID}]`).join('\n'))
            .setFooter('jika ada list yang bernama `undefined` segera hapus dengan command removear!')
        await message.channel.send(embed);
    } catch (error) {
        return console.log(error)
        // Restart the bot as usual.
    }
}

exports.conf = {
    aliases: [],
    cooldown: 5
}

exports.help = {
    name: 'listar',
    description: '',
    usage: '',
    example: ''
}