const Discord = require('discord.js');
const cooldowns = new Discord.Collection();

module.exports = async (client, message) => {
    if (message.type === 'DEFAULT' && message.author.bot === true && message.channel.id === '831475856882925629') require('../handler/Trakteer.js')(client, message);

    let prefix;
    if (message.content.toLowerCase().startsWith(client.config.prefix[0])) {
        prefix = client.config.prefix[0]; // Cek folder, config.json.
    } else if (message.content.toLowerCase().startsWith(client.config.prefix[1])) {
        prefix = client.config.prefix[1];
    }

    /** Attachments */
    if (message.attachments.size > 0) {
        const collection = client.cacheAttachments;
        const attachment = message.attachments.first();
        const image = attachment.url;
        const buffer = await require('got')(image).buffer();
        const file = new Discord.MessageAttachment().setFile(buffer).setName(message.id + '.png');
        collection.set(message.id, file);
    };

    require('../handler/AFK')(client, message);

    if (!message.content.toLowerCase().startsWith(prefix)) return;

    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let msg = message.content.toLowerCase();
    let cmd = args.shift().toLowerCase();
    let sender = message.author;

    let commandFile = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
    if (!commandFile) return;

    if (!cooldowns.has(commandFile.help.name)) {
        cooldowns.set(commandFile.help.name, new Discord.Collection());
    }

    if (commandFile.help.name === 'bot') return commandFile.run(client, message, args);
    const thisCommandIsSolve = await require('../handler/cmdManager')(client, message, cmd);
    if (!thisCommandIsSolve) return;

    const member = message.member;
    const now = Date.now();
    const timestamps = cooldowns.get(commandFile.help.name);
    const cooldownAmount = (commandFile.conf.cooldown || 3) * 1000

    if (!timestamps.has(member.id)) {
        if (!client.config.owners.includes(message.author.id)) {
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
};