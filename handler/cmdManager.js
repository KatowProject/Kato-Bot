const db = require('../database').cmd;

module.exports = async (client, message, cmdName) => {
    let isValid = true;
    let getGuild = db.get(`${message.guild.id}`);
    if (!getGuild) getGuild = db.set(`${message.guild.id}`, { all: [], cmd: [] });

    const all = getGuild.all;
    all.includes(message.channel.id) ? isValid = false : isValid = true;
    if (!isValid) return false;

    const cmd = getGuild.cmd;
    const getcmd = cmd.find(a => a.name === cmdName);
    if (!getcmd) return true;

    const channel = getcmd.channel;
    channel.includes(message.channel.id) ? isValid = false : isValid = true;

    return isValid;
}