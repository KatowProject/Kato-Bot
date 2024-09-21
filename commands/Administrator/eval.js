const { EmbedBuilder, Message } = require("discord.js");
const Client = require("../../core/ClientBuilder");

/**
 *
 * @param {Client} client
 * @param {Message} message
 * @param {[]} args
 * @returns
 */
exports.run = async (client, message, args) => {
  if (!client.config.discord.owners.includes(message.author.id))
    return message.reply(
      "Kamu tidak memiliki izin untuk menggunakan perintah ini!"
    );

  try {
    let codein = args.join(" ");
    if (!codein) return;

    let code = await new Promise((resolve) => resolve(eval(codein)));

    if (typeof code !== "string")
      code = require("util").inspect(code, { depth: 0 });
    if (code.length >= 4096) code = code.substr(0, 4000) + "...";

    const embed = new EmbedBuilder()
      .setAuthor({ name: "Evaluation" })
      .setTitle("Output")
      .setColor("#b5ec8a")
      .setDescription(`\`\`\`js\n${code}\n\`\`\``);

    message.channel.send({ embeds: [embed] });
  } catch (e) {
    const embed = new EmbedBuilder()
      .setAuthor({ name: "Evaluation" })
      .setTitle("Error")
      .setColor("#eb6162")
      .setDescription(`\`\`\`js\n${e}\n\`\`\``);
    message.channel.send({ embeds: [embed] });
  }
};

exports.conf = {
  aliases: ["e"],
  cooldown: 1,
  location: __filename,
};

exports.help = {
  name: "eval",
  description: "owner only",
  usage: "eval <code>",
  example: "eval",
};
