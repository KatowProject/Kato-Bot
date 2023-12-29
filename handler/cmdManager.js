const manager = require('../database/schemas/manageCommand');

module.exports = async (client, message, cmdName) => {
    /** all_cmd */
    let getChannel = await manager.allCommands.findOne({ guild: message.guild.id });
    if (!getChannel) getChannel = await manager.allCommands.create({ guild: message.guild.id, channels: [] });

    const isValid = getChannel.channels.includes(message.channel.id);
    if (isValid) return false;

    /** Specifict */
    let findCmd = await manager.specificCommands.findOne({ guild: message.guild.id });
    if (!findCmd) findCmd = await manager.specificCommands.create({ guild: message.guild.id, command: [] });

    const findChannel = findCmd.command.find(a => a.name === cmdName);
    if (!findChannel) return true;

    const isValidCmd = findChannel.channels.includes(message.channel.id);
    if (isValidCmd) return false;

    return true;
}