const { Client, Message } = require('discord.js');

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {String} cmdName 
 * @returns Boolean<true|false>
 */
module.exports = async (client, message, cmdName) => {
    const db = client.db.cmd;
    let isValid = true;
    let getGuild = await db.get(`${message.guild.id}`);
    if (!getGuild) getGuild = await db.set(`${message.guild.id}`, { all: [], cmd: [] });

    const { all } = getGuild;
    all.includes(message.channel.id) ? isValid = false : isValid = true;
    if (!isValid) return false;

    const cmd = getGuild.cmd;
    const getcmd = cmd.find(a => a.name === cmdName);
    if (!getcmd) return true;

    const channel = getcmd.channel;
    channel.includes(message.channel.id) ? isValid = false : isValid = true;

    return isValid;
}