const { Collection, Message } = require("discord.js");
const colors = require("colors");

const Client = require("../core/ClientBuilder");

const cooldowns = new Collection();

/**
 *
 * @param {Client} client
 * @param {Message} message
 */
module.exports = async (client, message) => {
  if (
    client.config.discord.owner_only &&
    !client.config.discord.owners.includes(message.author.id)
  )
    return;

  if (message.author.bot) return;

  let prefix = null;
  for (const p of client.config.discord.prefix)
    message.content.startsWith(p) ? (prefix = p) : null;

  require("../handler/attachment")(client, message);
  require("../handler/afk")(client, message);
  require("../handler/donaturPoster")(client, message);

  if (!message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();
  const sender = message.author;

  const command =
    client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
  if (!command) return;

  if (!cooldowns.has(command.help.name)) {
    cooldowns.set(command.help.name, new Collection());
  }

  if (!client.config.discord.owners.includes(sender.id)) {
    const isValid = await require("../handler/command")(client, message, cmd);
    if (isValid) return;
  }

  const member = message.member;
  const now = Date.now();
  const timestamps = cooldowns.get(command.help.name);
  const cooldownAmount = (command.conf.cooldown || 3) * 1000;

  if (!timestamps.has(member.id)) {
    if (!client.config.discord.owners.includes(member.id))
      timestamps.set(member.id, now);
  } else {
    const expirationTime = timestamps.get(member.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        `please wait ${timeLeft.toFixed(
          1
        )} more second(s) before reusing the \`${command.help.name}\` command.`
      );
    }

    timestamps.set(member.id, now);
    setTimeout(() => timestamps.delete(member.id), cooldownAmount);
  }

  try {
    command.run(client, message, args);
  } catch (error) {
    console.error(colors.red(error));
  } finally {
    console.log(
      colors.bgGreen(
        `[${new Date().toLocaleString()}] ${
          sender.tag
        } menggunakan perintah: ${cmd}`
      )
    );
  }
};
