const { Client, BaseInteraction, ButtonInteraction } = require('discord.js');

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

    if (member.roles.cache.has(santai.id)) return;
    member.roles.add(santai);

    //send on dm 
    interaction.followUp({ content: `Selamat, kamu mendapatkan role ${santai.name}!`, ephemeral: true });

    client.channels.cache.find(c => c.name === 'chit-chat').send(`Halo <@${interaction.user.id}>, kamu sudah bisa mengakses channel POS. Selamat berinteraksi dan semoga nyaman disini.`);
}