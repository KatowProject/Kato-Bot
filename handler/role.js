const { Client, BaseInteraction, ButtonStyle, AttachmentBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');

/**
 * 
 * @param {Client} client 
 * @param {BaseInteraction} interaction 
 */
module.exports = async (client, interaction) => {
    if (!interaction.customId.includes('selfrole')) return;

    const role = interaction.customId.split('-')[0];
    const id = interaction.customId.split('-')[1];
    if (!id) return;

    await interaction.deferUpdate();

    const fps = '932997958738268252';
    const moba = '932997958738268253';
    const general = '932997958738268254';
    const zomboid = '968116058865164318';
    const rust = '1130049980707643492';

    const memberRoles = interaction.member._roles;
    switch (role) {
        // check if member already has the role
        case 'fps':
            if (memberRoles.includes(fps))
                removeRole(fps);
            else
                addRole(fps);
            break;

        case 'moba':
            if (memberRoles.includes(moba))
                removeRole(moba);
            else
                addRole(moba);
            break;

        case 'general':
            if (memberRoles.includes(general))
                removeRole(general);
            else
                addRole(general);
            break;

        case 'zomboid':
            if (memberRoles.includes(zomboid))
                removeRole(zomboid);
            else
                addRole(zomboid);
            break;

        case 'rust':
            if (memberRoles.includes(rust))
                removeRole(rust);
            else
                addRole(rust);
            break;
    }

    async function addRole(role) {
        const r = interaction.guild.roles.cache.get(role);
        if (!r) return;

        await interaction.member.roles.add(role);

        await interaction.followUp({ content: `Kamu mendapatkan role \`${r.name}\`  !`, ephemeral: true });
    }


    async function removeRole(role) {
        const r = interaction.guild.roles.cache.get(role);

        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`yes`).setLabel('Ya').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId(`no`).setLabel('Tidak').setStyle(ButtonStyle.Danger)
        );

        const msg = await interaction.followUp({ content: `Kamu akan kehilangan role \`${r.name}\`, apakah kamu yakin?`, components: [buttons], ephemeral: true });
        const collector = msg.createMessageComponentCollector({ filter: i => i.user.id === interaction.user.id && (i.customId === 'yes' || i.customId === 'no'), time: 30_000 });
        collector.on('collect', async i => {
            if (i.customId === `yes`) {
                await interaction.member.roles.remove(role);
                await i.update({ content: `Kamu kehilangan role \`${r.name}\`!`, components: [] });
            } else if (i.customId === `no`) {
                await i.update({ content: `Role ${r.name} tidak dihapus!`, components: [] });
            }
        });

        collector.on('end', async () => {
            if (!msg.deleted) {
                await msg.delete();
            }
        });
    }
}