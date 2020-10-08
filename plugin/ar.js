const { MessageEmbed, WebhookClient } = require('discord.js');
const db = require('quick.db');

module.exports = async (client, message) => {

    let table = new db.table('ARs').all();
    try {
        let msg = table.find(a => a.ID === message.content.toLowerCase());
        let ar = JSON.parse(msg.data);
        let random = Math.floor(Math.random() * ar.image.length);

        if (ar.image.length < 1) {
            message.channel.send(ar.text);
        } else {
            const embed2 = new MessageEmbed()
                .setColor(client.warna.kato)
                .setDescription(ar.text)
                .setImage(ar.image[random])
            message.channel.send(embed2);
        };


    } catch (error) {
        return;
    };

    //trigger 

}