const { EmbedBuilder, Message } = require("discord.js");
const Client = require("../../core/ClientBuilder");

/**
 * @param {Client} client
 * @param {Message} message
 * @param {Array} args
 */
exports.run = async (client, message, args) => {
  try {
    const prefix = client.config.discord.prefix;
    if (!args[0]) {
      let module = Array.from(client.helps.values());
      // if (!client.config.owners.includes(message.author.id))
      module = module.filter((x) => !x.hide);

      const embed = new EmbedBuilder()
        .setColor("Random")
        .setTimestamp()
        .setFooter({
          text: `© 2023 Perkumpulan Orang Santai • Total: ${client.commands.size} commands`,
          iconURL: client.user.avatarURL(),
        })
        .setDescription(
          `Ketik \`${prefix[0]}help [command] / ${prefix[0]}help [command]\` untuk menambahkan informasi lebih lanjut mengenai sebuah perintah.`
        )
        .setTitle(
          `<:kato:750342786825584811> ${client.user.username}-Bot Command List <:kato:750342786825584811>`
        );

      for (const mod of module) {
        embed.addFields({
          name: `${mod.name}`,
          value: mod.cmds.map((x) => `\`${x}\``).join(" . "),
          inline: true,
        });
      }

      message.channel.send({ embeds: [embed] });
    } else {
      const cmd = args[0];
      if (
        client.commands.has(cmd) ||
        client.commands.get(client.aliases.get(cmd))
      ) {
        let command =
          client.commands.get(cmd) ||
          client.commands.get(client.aliases.get(cmd));
        let name = command.help.name;
        let desc = command.help.description;
        let cooldown = command.conf.cooldown;
        let aliases = command.conf.aliases.join(", ")
          ? command.conf.aliases.join(", ")
          : "No aliases provided.";
        let usage = command.help.usage
          ? prefix + command.help.usage
          : "No usage provided.";
        let example = command.help.example
          ? prefix + command.help.example
          : "No example provided.";

        let embed = new EmbedBuilder()
          .setColor("#985ce7")
          .setTitle(name)
          .setDescription(desc)
          .setThumbnail(
            client.user.avatarURL({ forceStatic: true, size: 4096 })
          )
          .setFooter({
            text: "[] opsional, <> diwajibkan. • Jangan tambahkan simbol ini ketika mengetik sebuah perintah.",
          })
          .addFields(
            { name: "Usage", value: usage, inline: true },
            { name: "Aliases", value: aliases, inline: true },
            { name: "Cooldown", value: `${cooldown} second(s)`, inline: true },
            { name: "Example", value: `${example}`, inline: true }
          );
        return message.channel.send({ embeds: [embed] });
      }
      if (
        !client.commands.has(cmd) ||
        !client.commands.get(client.aliases.get(cmd))
      ) {
        message.channel.send({
          embed: { color: 0xcc5353, description: "gaada command bos, dih." },
        });
      }
    }
  } catch (err) {
    console.log(err);
    message.channel.send({ content: "Something wrong with: " + err.message });
  }
};

exports.conf = {
  aliases: [],
  cooldown: 5,
  location: __filename,
};

exports.help = {
  name: "help",
  description: "Menampilkan daftar perintah bot Kato.",
  usage: "help [command name]",
  example: "help [command name]",
};
