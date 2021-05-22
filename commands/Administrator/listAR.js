const Discord = require('discord.js');
const AR = require('../../database/schema/autoResponse');

exports.run = async (client, message, args) => {

    try {

        //get data | array
        const ARs = await AR.findOne({ guild: message.guild.id });
        if (!ARs) return message.reply('Gk ada data!');

        //send to user
        const embed = new Discord.MessageEmbed()
            .setColor(client.warna.kato)
            .setAuthor('List Autorespond:', message.guild.iconURL({ size: 2048, dynamic: true }))
            .setDescription(ARs.data.map((a, i) => `**${i + 1}**. ${a.name}`))
            .setFooter('jika ada list yang bernama `undefined` segera hapus dengan command removear!')
        await message.channel.send(embed);
    } catch (error) {
        return message.reply('Something went wrong:\n' + error.message);
        // Restart the bot as usual.
    }
}

exports.conf = {
    aliases: [],
    cooldown: 5,
    permissions: ['ADMINISTRATOR']
}

exports.help = {
    name: 'listar',
    description: 'list AR',
    usage: '',
    example: ''
}