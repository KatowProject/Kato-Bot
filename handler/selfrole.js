const { Client, BaseInteraction, ButtonInteraction, AttachmentBuilder } = require('discord.js');
const { loadImage, createCanvas } = require('canvas');

/**
 * @param {Client} client 
 * @param {ButtonInteraction} interaction 
 */
module.exports = async (client, interaction) => {
    if (interaction.customId !== 'santai') return;
    await interaction.deferUpdate();

    //give santai role to players when clicked
    const santai = interaction.message.guild.roles.cache.find(r => r.name === 'Santai');
    const member = await interaction.message.guild.members.fetch(interaction.user.id);
    const avatar = await loadImage(member.user.displayAvatarURL({ size: 4096, extension: 'png' }));
    if (member.roles.cache.has(santai.id)) return;
    member.roles.add(santai);

    const template = await loadImage('https://cdn.discordapp.com/attachments/812005987204595752/1086917715350011934/met_datang.png');
    const canvas = createCanvas(template.width, template.height);
    const ctx = canvas.getContext('2d');

    const middle_circle = 136;
    ctx.drawImage(avatar, middle_circle, 100, 340, 340);
    ctx.drawImage(template, 0, 0, canvas.width, canvas.height);

    const buffer = canvas.toBuffer('image/png');
    const attachment = new AttachmentBuilder(buffer, { name: 'welcome.png' });

    //send on dm 
    interaction.followUp({ content: `Selamat, kamu mendapatkan role ${santai.name}!`, ephemeral: true });

    client.channels.cache.find(c => c.name === 'chit-chat').send({ content: `Selamat datang di server POS, <@${interaction.user.id}>! Semoga kamu merasa nyaman dan menemukan teman baru di sini.`, files: [attachment] });
}