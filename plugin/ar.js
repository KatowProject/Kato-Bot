const { MessageEmbed, WebhookClient, ClientUser } = require('discord.js');
const AR = require('../database/schema/autoResponse');

module.exports = async (client, message) => {

    if (message.author.id !== '458342161474387999') return;

    const ar = await AR.find({ guild: message.guild.id });

    try {
        if (ar.length === 0) {

            await AR.create({ guild: message.guild.id, data: [] });
            return message.reply('Database Auto Respond telah dibuat, silahkan buat permintaan kembali!');

        } else {

            const ARs = ar[0].data;
            if (!ARs.length) return;
            const content = ARs.find(a => a.name == message.content.toLowerCase());
            if (!content) return;

            if (content.image.length < 1) {
                message.channel.send(content.text);
            } else {
                const embed2 = new MessageEmbed()
                    .setColor(client.warna.kato)
                    .setDescription(content.text)
                    .setImage(content.image[client.util.randomNumber(content.image)])
                message.channel.send(embed2);
            };

        }


    } catch (error) {
        return message.reply('Something went wrong:\n' + error.message);
    };

    //trigger 

}