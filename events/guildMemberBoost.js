const { Client, Message, EmbedBuilder, GuildMember, AttachmentBuilder, WebhookClient } = require('discord.js');
const DiscordCanvas = require('../modules/Discord-Canvas');

const images = [
    'https://media1.tenor.com/images/bc58975b4797d945c2cdffe2dda64a0f/tenor.gif',
    'https://www.animefeminist.com/wp-content/uploads/2018/03/Samantha-Coming-Out-003-20180312.jpg',
    'https://i.kym-cdn.com/photos/images/original/001/155/275/559.gif',
    'https://media3.giphy.com/media/kigfYxdEa5s1ziA2h1/source.gif',
    'https://media.giphy.com/media/XreQmk7ETCak0/giphy.gif',
    'https://media1.tenor.com/images/0ec6bf6d627e139db6028651b213e841/tenor.gif',
    'https://gif-free.com/uploads/posts/2017-05/1493703506_spongebob-thumb-up.gif'
];

/**
 * 
 * @param {Client} client 
 * @param {GuildMember} member 
 */
module.exports = async (client, member) => {
    const random = Math.floor(Math.random() * images.length);
    const embed = new EmbedBuilder()
        .setColor('Random')
        .setAuthor({ name: 'Member Boost', iconURL: 'https://cdn.discordapp.com/emojis/638719606738911236.gif' })
        .setDescription(`Hai <@${member.user.id}>, terima kasih telah boost di server Perkumpulan Orang Santai ヾ(≧▽≦*)o `)
        .setImage(images[random])
    // client.channels.cache.find(a => a.name === 'chit-chat').send({ embeds: [embed] });

    // set username
    const boosterNotification = new DiscordCanvas().loadBoosterNotification();
    boosterNotification.setUsername(member.user.username);
    await boosterNotification.setAvatar(member.user.displayAvatarURL({ extension: 'png' }));
    boosterNotification.setDate(new Date());

    // create image
    const buffer = await boosterNotification.generate();
    const attachment = new AttachmentBuilder(buffer, { name: 'booster-notification.png' });

    // webhook
    const id = process.env.TRAKTEER_NOTIFICATION_WEBHOOK.split("/")[5];
    const token = process.env.TRAKTEER_NOTIFICATION_WEBHOOK.split("/")[6];

    const webhook = new WebhookClient({ id, token });
    webhook.send({ files: [attachment] });

    // await client.donaturManager.addDonaturBooster(member);
}