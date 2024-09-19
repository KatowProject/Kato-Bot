const { Message } = require("discord.js");
const Client = require("../../core/ClientBuilder");

const fs = require("fs");
const path = require("path");
const JSZip = require("jszip");
const backup = require("../../database/backup");

const zip = new JSZip();

/**
 *
 * @param {Client} client
 * @param {Message} message
 * @param {[]} args
 */
exports.run = async (client, message) => {
  if (!client.config.discord.owners.includes(message.author.id)) return;

  const m = await message.channel.send("Creating backup...");

  try {
    await backup(client.config.database.uri);

    const files = fs.readdirSync(path.join(__dirname, "../../database/backup"));
    for (const file of files) {
      const data = fs.readFileSync(
        path.join(__dirname, "../../database/backup", file)
      );

      zip.file(file, data);
    }

    const buffer = await zip.generateAsync({ type: "nodebuffer" });

    await m.delete();

    await message.channel.send({
      files: [
        {
          attachment: buffer,
          name: "backup.zip",
        },
      ],
      content: "Backup created successfully!",
    });
  } catch (err) {
    console.error(err);

    await m.edit("Failed to create backup.");
  }
};

exports.conf = {
  aliases: [],
  cooldown: 5,
  location: __filename,
};

exports.help = {
  name: "backup",
  description: "Backup server",
  usage: "backup",
  example: "backup",
};
