const Discord = require('discord.js');

exports.run = async (client, message, args) => {
  if (message.author.id !== "458342161474387999") return;

  try {
    let string_message = args.slice(0).join(" ");
    if (string_message == "") string_message = " ";

    if (message.attachments.size > 0) {
      // Last Message ID
      let mAuthor = message.author.lastMessageID;
      // Get Last Message ID
      let message_id = message.channel.messages.cache.get(`${mAuthor}`);
      // Attachment ID
      let gAttachment = message_id.attachments.map(file => file.id);
      // Get Attachment ID
      let attachment_id = message_id.attachments.get(`${gAttachment}`);
      // URL Images
      let attached = `${attachment_id.url}`;

      message.delete()

      // Attach an image
      message.channel.send(`${string_message}`, { disableEveryone: true, files: [`${attached}`] });
    }
    else {
      //check apakah tidak ada args[0]
      //jika iya, maka return kosong (tidak merespon message)
      if (!args[0]) {
        return;
      }
      //jika tidak, maka eksekusi instruksi dibawahnya
      else {
        message.delete();

        //message no attachment
        message.channel.send(`${string_message}`, { disableEveryone: true });
      }
    }
  } catch (error) {
    return message.channel.send(`Something went wrong: ${error.message}`);
    // Restart the bot as usual.
  };
};

exports.conf = {
  aliases: ["p"],
  cooldown: 5
};

exports.help = {
  name: 'say',
  description: 'katakan sesuatu maka aku akan mengikutinya!',
  usage: 'k!say [isi]',
  example: 'k!say kato cantik'
};