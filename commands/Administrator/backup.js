const { Client, Message } = require('discord.js');
const backup = require('../../database/backup.js');
const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');
const zip = new JSZip();

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {*} args 
 */
exports.run = async (client, message, args) => {
    if (message.author.id !== process.env.DISCORD_OWNERS) return message.channel.send('You are not my owner!');

    message.channel.send('Backup database...');
    try {
        await backup(process.env.DB_URI, false);

        const file = fs.readdirSync(path.join(__dirname, '../../database/backup'));
        for (const f of file) {
            zip.file(f, fs.readFileSync(path.join(__dirname, '../../database/backup', f)));
        }

        const buffer = await zip.generateAsync({ type: 'nodebuffer' });
        message.channel.send({
            files: [{
                attachment: buffer,
                name: 'backup.zip'
            }],
            content: 'Backup database success!'
        });
    } catch (error) {
        message.channel.send('Backup database failed!');
    }
};

exports.conf = {
    aliases: ['bk'],
    cooldown: 5
}

exports.help = {
    name: 'backup',
    description: 'Backup database',
    usage: 'backup',
    example: 'backup'
}