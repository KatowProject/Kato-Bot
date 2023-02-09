const { Collection, AttachmentBuilder } = require('discord.js');
const axios = require('axios');
const cooldowns = new Collection();

module.exports = async (client, message) => {
    if (message.content.toLowerCase() === 'kato') message.reply("Cantik ❤️");

    if (message.author.bot) return;
    let prefix;
    if (message.content.toLowerCase().startsWith(process.env.DISCORD_PREFIX)) {
        prefix = process.env.DISCORD_PREFIX; // Cek folder, config.json.
    } else if (message.content.toLowerCase().startsWith(process.env.DISCORD_PREFIX2)) {
        prefix = process.env.DISCORD_PREFIX2;
    }

    /** Attachments */
    if (message.attachments.size > 0) {
        const collection = client.cache;
        const attachment = message.attachments.first();
        const image = attachment.url;
        const buffer = await axios.get(image, { responseType: 'arraybuffer' });
        const file = new AttachmentBuilder(buffer.data).setName(attachment.filename);
        collection.set(message.id, file);
    };

    require('../handler/Afk')(client, message);

    if (!message.content.toLowerCase().startsWith(prefix)) return;
    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    //let msg = message.content.toLowerCase();
    let cmd = args.shift().toLowerCase();
    let sender = message.author;

    const commandFile = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
    if (!commandFile) return;

    if (!cooldowns.has(commandFile.help.name)) {
        cooldowns.set(commandFile.help.name, new Collection());
    }

    if (commandFile.help.name === 'bot') return commandFile.run(client, message, args);
    const thisCommandIsSolve = await require('../handler/cmdManager')(client, message, cmd);
    if (!thisCommandIsSolve) return;

    console.log(message.content);
    const member = message.member;
    const now = Date.now();
    const timestamps = cooldowns.get(commandFile.help.name);
    const cooldownAmount = (commandFile.conf.cooldown || 3) * 1000

    if (!timestamps.has(member.id)) {
        if (!process.env.DISCORD_OWNERS.includes(message.author.id)) {
            timestamps.set(member.id, now);
        }
    } else {
        const expirationTime = timestamps.get(member.id) + cooldownAmount;
        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.channel.send(`Tenang atuh cuk, tunggu **${timeLeft.toFixed(1)}** detik baru bisa pake.`);
            // Bisa diubah teks nya, kalo misalnya user nya lagi cooldown.
        }

        timestamps.set(member.id, now);
        setTimeout(() => timestamps.delete(member.id), cooldownAmount);
    }

    try {
        commandFile.run(client, message, args);
    } catch (e) {
        console.log(e.message);
    } finally {
        console.log(`${sender.tag} (${sender.id}) ran ${cmd}`); // Mengetahui, siapa aja yang make command (cuman di console log aja kok)
    }
};