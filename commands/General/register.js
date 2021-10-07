const Discord = require('discord.js');
const db = require('../../database/schema/event');
const datauser = require('../../database/schema/xp_player');

exports.run = async (client, message, args) => {

    const datasuser = await datauser.findOne({ id: 1 });
    const isEnough = datasuser.data.find(a => a.id === message.author.id);
    if (!isEnough || isEnough.level < 15) {
        const member = message.guild.members.cache.get(message.author.id);
        const haveRole = member.roles.cache.has('438335830726017025') || member.roles.cache.has('589047055360589824');
        if (!haveRole) return message.reply('Level kamu tidak mencukupi!');
    }
    const user = await db.findOne({ userID: message.author.id });
    if (user) return message.reply('Kamu telah terdaftar!');

    await db.create({
        userID: message.author.id,
        ticket: 0,
        isParticipant: false,
        isAttend: false,
        message: {
            daily: 0,
            base: 0,
            isComplete: false
        }
    });
    message.reply('Pendaftaran telah berhasil!');

}

exports.conf = {
    aliases: [],
    cooldown: 5
};

exports.help = {
    name: 'register',
    description: 'daftar',
    usage: 'register',
    example: 'register'
}