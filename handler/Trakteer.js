const donaturs = require('../database/schema/Donatur');
const Discord = require('discord.js');

module.exports = async (client, message, data) => {
    const name = data.nama;
    const value = data.unit.length.split('x').pop().trim();
    const nominal = data.nominal.split("v")[0].trim();
    const duration = value * 28;
    const toMS = require('ms')(`${duration}d`);
    const msg = data.message.split("\n").join(" ");
    const date = data.date;

    const members = await message.guild.members.fetch();
    const member = members.find(m => m.user.tag.toLowerCase() === name.toLowerCase());

    const canvas = client.canvas;
    canvas.setUsername(name);
    canvas.setDonation(`x${value}`);
    canvas.setSupportMessage(`"${msg}"`);
    canvas.setDate(date);
    canvas.setNominal(nominal);

    await canvas.setTemplate();
    if (member)
        await canvas.setAvatar(member.user.displayAvatarURL({ format: 'png', size: 4096 }));
    else
        await canvas.setAvatar(data.unit.image);

    const buffer = await canvas.generate();
    const attachment = new Discord.MessageAttachment(buffer, 'donation.png');
    const id = client.config.webhook.split("/")[5];
    const token = client.config.webhook.split("/")[6];
    const webhook = new Discord.WebhookClient({ id, token });
    webhook.send({ files: [attachment] });

    if (!member) return client.channels.cache.get('1013977865756356658')
        .send(`Hai Para Staff, ada Donatur yang tidak dapat Kato temui dalam Server, maaf kato tidak dapat memberikan role-nya secara otomatis :(`);

    const role = message.guild.roles.cache.find(r => r.name === 'Santai Dermawan');
    if (!role) return client.channels.cache.get('1013977865756356658')
        .send('Hai Para Staff, Role yang kato pasang tidak dapat ditemukan, tolong buatlah Role dengan nama **Santai Dermawan**');

    const findUser = await donaturs.findOne({ userID: member.id });
    const channel = client.channels.cache.get('1013977865756356658');
    if (findUser) {
        findUser.duration = findUser.duration + toMS;
        await findUser.save();
        channel.send(`Hai Para Staff, Donatur **${member.user.tag}** telah diperpanjang durasinya selama **${duration} hari**.`);
        member.send(`Hai ${member.user.tag}, kato telah memperpanjang durasi role kepada kamu selama **${duration} hari**, Terima Kasih atas dukungannya!`);
    } else {
        await donaturs.create({ userID: member.id, guild: message.guild.id, duration: toMS, now: Date.now() });
        member.roles.add(role.id);
        channel.send(`Hai Para Staff, **${member.user.tag}** terdaftar sebagai Donatur baru, silahkan cek untuk memastikan!`);
        member.send(`Hai ${member.user.tag}, kato telah memberikan role **Santai Dermawan** kepada Kamu selama **${duration} hari**, Terima Kasih atas dukungannya!`);
    }
}