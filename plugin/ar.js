const { MessageEmbed, WebhookClient } = require('discord.js');
const db = require('../database');

module.exports = async (client, message) => {

    let table = db.ar;
    try {
        let msg = table.get(message.content.toLowerCase());
        if (msg === null) return;
        let random = Math.floor(Math.random() * msg.image.length);

        if (msg.image.length < 1) {
            message.channel.send(msg.text);
        } else {
            const embed2 = new MessageEmbed()
                .setColor(client.warna.kato)
                .setDescription(msg.text)
                .setImage(msg.image[random])
            message.channel.send(embed2);
        };

    } catch (error) {
        return;
    };

    //trigger 

}