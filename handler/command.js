const Client = require("../core/ClientBuilder");
const { Message } = require("discord.js");

const CmdAll = require("../database/schemas/command_channel");
const CmdSpecific = require("../database/schemas/command");

/**
 *
 * @param {Client} client
 * @param {Message} message
 * @param {string} name
 */
module.exports = async (client, message, name) => {
  let cmdsAll = await CmdAll.findOne({ guild: message.guild.id });
  if (!cmdsAll)
    await new CmdAll({ guild: message.guild.id, channels: [] }).save();

  const isValid = cmdsAll.channels.includes(message.channel.id);
  if (!isValid) return false;

  const cmdSpecific = await CmdSpecific.findOne({
    guild: message.guild.id,
    "command.name": name,
  });
  if (!cmdSpecific) return true;

  const isValidCmd = cmdSpecific.command.channels.includes(message.channel.id);
  if (!isValidCmd) return false;

  return true;
};
