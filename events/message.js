const Discord = require('discord.js');
const cooldowns = new Discord.Collection();
const db = require('../database').cmd;
const log = require('../database').log;

module.exports = async (client, message) => {

  if (message.channel.type === "dm" || message.author.bot || message.author === client.user) return;

  const dataGuild = log.get(message.guild.id);
  if (!dataGuild) {
    log.set(message.guild.id, { feedbacks: 'null', ban: 'null', mute: 'null', elm: 'null', kick: 'null' });
    message.reply('Database telah dibuat!');
  };

  let prefix;
  if (message.content.toLowerCase().startsWith(client.config.discord.prefix[0])) {
    prefix = client.config.discord.prefix[0]; // Cek folder, config.json.
  } else if (message.content.toLowerCase().startsWith(client.config.discord.prefix[1])) {
    prefix = client.config.discord.prefix[1];
  }
  require('../plugin/ar.js')(client, message)
  require('../plugin/afk.js')(client, message)

  if (message.attachments.size > 0) {

    const AttachmentCollection = client.dataAttachment;
    const attachment = Array.from(message.attachments)[0];
    const image = attachment[1].url;
    const format = image.match(/\.(gif|jpe?g|tiff?|png|webp|bmp|mp4|mp3|zip|rar|exe)$/i)[0];
    const toBuffer = await require('got')(image).buffer();

    AttachmentCollection.set(message.author.lastMessageID, { buffer: toBuffer, filename: image + format });
  }
  //Prefix nya bisa antara di mention, ama antara pake prefix biasa (k!)
  if (!message.content.toLowerCase().startsWith(prefix)) return;

  let args = message.content.slice(prefix.length).trim().split(/ +/g);
  let msg = message.content.toLowerCase();
  let cmd = args.shift().toLowerCase();
  let sender = message.author;

  message.flags = [];
  while (args[0] && args[0][0] === "-") {
    message.flags.push(args.shift().slice(1));
  } // Ini tuh ibaratkan parameter.



  let commandFile = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
  if (!commandFile) return;
  if (!cooldowns.has(commandFile.help.name)) {
    cooldowns.set(commandFile.help.name, new Discord.Collection());
  }

  /* OFF ALL*/
  let channels = db.get('off');
  if (!channels) channels = [];
  if (channels.includes(message.channel.id)) {

    if (commandFile.help.name === 'on') {
      return commandFile.run(client, message, args);
    } else return;

  };

  /* OFF OF SPECIFIC */
  let channel = db.get(commandFile.help.name);
  if (!channel) channel = [];
  if (channel.includes(message.channel.id)) return;

  /* PERMISSION CHECK */
  if (!message.member.hasPermission(commandFile.conf.permissions)) return message.channel.send(`Not Enough Permission!\n**Require: ${commandFile.conf.permissions.join(', ')} **`);


  const member = message.member;
  const now = Date.now();
  const timestamps = cooldowns.get(commandFile.help.name);
  const cooldownAmount = (commandFile.conf.cooldown || 3) * 1000

  if (!timestamps.has(member.id)) {
    if (!client.config.discord.owners.includes(message.author.id)) {
      timestamps.set(member.id, now);
    }
  } else {
    const expirationTime = timestamps.get(member.id) + cooldownAmount;

    if (now < expirationTime) {

      const timeLeft = (expirationTime - now) / 1000;
      return message.channel.send({ embed: { color: 0xcc5353, description: `Tenang atuh cuk, tunggu **${timeLeft.toFixed(1)}** detik baru bisa pake.` } }).then(msg => msg.delete({ timeout: 5000 }));
      // Bisa diubah teks nya, kalo misalnya user nya lagi cooldown.
    }

    timestamps.set(member.id, now);
    setTimeout(() => timestamps.delete(member.id), cooldownAmount);
  }



  try {
    let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd)); // Jalani command dengan aliases juga bisa. Misalnya: k!serverinfo, k!server, k!s
    command.run(client, message, args);
  } catch (e) {
    console.log(e.message);
  } finally {
    console.log(`${sender.tag} (${sender.id}) ran ${cmd}`); // Mengetahui, siapa aja yang make command (cuman di console log aja kok)
  }
}