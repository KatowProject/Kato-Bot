const Discord = require('discord.js');

exports.run = async (client, message, args) => {
    try {
        const isDonatur = message.member.roles.cache.hasAny('933117751264964609', '932997958788608044');
        if (!isDonatur) return message.channel.send("Kamu bukan donatur atau booster");

        client.tempEvent.daily(message);
    } catch (err) {
        message.channel.send({ content: 'Something wrong with: ' + err.message });
    }
}

exports.conf = {
    cooldown: 5,
    aliases: []
}

exports.help = {
    name: "event-daily",
    description: "Mendapatkan hadiah event.",
    usage: "event-daily",
    example: "event-daily"
}
