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
  const cmdsAll = await CmdAll.findOne({ guild: message.guild.id });
  if (!cmdsAll)
    await new CmdAll({ guild: message.guild.id, channels: [] }).save();

  const isValid = cmdsAll.channels.includes(message.channel.id);
  if (!isValid) return false;

  const cmdSpecific = await CmdSpecific.findOne({ guild: message.guild.id });
  if (!cmdSpecific) return true;

  const cmd = cmdSpecific.commands.find((c) => c.name === name);
  if (!cmd) return true;

  const isCmd = cmd.channels.includes(message.channel.id);
  if (!isCmd) return false;

  return true;
};
