const { Message, AttachmentBuilder } = require("discord.js");
const Client = require("../../core/ClientBuilder");

/**
 *
 * @param {Client} client
 * @param {Message} message
 * @param {[]} args
 */
exports.run = async (client, message) => {
  try {
    const sticker = message.stickers.first();
    if (!sticker) {
      const msg = await message.channel.send({
        content: "Kirim sticker yang diinginkan!",
      });
      const collector = message.channel
        .createMessageCollector({
          filter: (m) => m.author.id === message.author.id,
          time: 20000,
        })
        .on("collect", async (f) => {
          if (
            ["cancel", "gk jadi", "gak jadi"].includes(f.content.toLowerCase())
          ) {
            collector.stop();
            return message.reply("Permintaan dibatalkan!");
          }
          if (!f.stickers.first())
            return message.reply("Permintaan invalid, gunakanlah sticker!");

          msg.delete();
          collector.stop();

          const sticker = f.stickers.first();
          const attachment = new AttachmentBuilder().setFile(sticker.url);
          message.channel.send({ files: [attachment] });
        });

      return;
    }

    const attachment = new AttachmentBuilder().setFile(sticker.url);
    message.channel.send({ files: [attachment] });
  } catch (err) {
    console.log(err);
    message.channel.send({ content: "Something wrong with: " + err.message });
  }
};

exports.conf = {
  aliases: [],
  cooldown: 5,
};

exports.help = {
  name: "sticker",
  description: "Get sticker url.",
  usage: "sticker <sticker>",
  example: "sticker <sticker>",
};
