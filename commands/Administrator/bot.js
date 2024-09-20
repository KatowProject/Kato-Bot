const Command = require("../../database/schemas/command_channel");
const { Message } = require("discord.js");
const Client = require("../../core/ClientBuilder");

/**
 *
 * @param {Client} client
 * @param {Message} message
 * @param {[]} args
 */
exports.run = async (client, message, args) => {
  if (!message.member.permissions.has("ManageChannels"))
    return message.reply("You do not have permission to use this command");

  const option = args[0];
  if (!option)
    return message.channel.send(
      "Please specify an option. Options: `add`, `remove`, `list`"
    );

  const channel = message.mentions.channels.first();
  const channelRegex = new RegExp(args.slice(1).join(" "), "i");

  if (!channel && !args[1]) return message.reply("Please specify a channel");

  const channelFind = message.guild.channels.cache.find(
    (ch) =>
      channelRegex.test(ch.name) || ch.id === args[1] || channel?.id === ch.id
  );

  let guildCommand = await Command.findOne({ guild: message.guild.id });
  if (!guildCommand) {
    guildCommand = new Command({
      guild: message.guild.id,
      channels: [],
    });

    await guildCommand.save();
  }

  if (option === "add") {
    if (!channelFind) return message.channel.send("Channel not found");
    if (guildCommand.channels.includes(channelFind.id))
      return message.channel.send("Channel already exists");

    guildCommand.channels.push(channelFind.id);
    await guildCommand.save();

    return message.channel.send(
      `Channel ${channelFind} has been added to the list of disabled command channels`
    );
  } else if (option === "remove") {
    if (!channelFind) return message.channel.send("Channel not found");
    if (!guildCommand.channels.includes(channelFind.id))
      return message.channel.send("Channel does not exist");

    guildCommand.channels = guildCommand.channels.filter(
      (ch) => ch !== channelFind.id
    );
    await guildCommand.save();

    return message.channel.send(
      `Channel ${channelFind} has been removed from the list of disabled command channels`
    );
  } else if (option === "list") {
    if (!guildCommand.channels.length)
      return message.channel.send("There are no disabled command channels");

    const channels = guildCommand.channels.map((ch) => `<#${ch}>`).join("\n");
    return message.channel.send(`Disabled command channels:\n${channels}`);
  } else {
    return message.channel.send(
      "Invalid option. Options: `add`, `remove`, `list`"
    );
  }
};

exports.conf = {
  aliases: ["cmdchannel"],
  cooldown: 5,
  location: __filename,
};

exports.help = {
  name: "bot-channel",
  description: "Disable commands in certain channels",
  usage: "bot <add|remove|list> [channel]",
  example: "bot add #general",
};
