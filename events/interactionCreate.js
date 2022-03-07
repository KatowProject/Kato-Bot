const db = require('../database').ga;

module.exports = async (client, interaction) => {
    if (interaction.customId === 'giveawayID') {
        await interaction.deferUpdate();

        const data = await db.get(interaction.message.id);
        // const xps = await dbxp.findOne({ id: 1 });
        // if (!xps) return;

        if (!data) return interaction.user.send('Giveaway tidak ditemukan!');
        if (data.isDone) return interaction.user.send('Giveaway telah berakhir!');
        if (data.entries.includes(interaction.user.id)) return interaction.user.send('Sudah terdaftar dalam giveaway!');

        let isOK = null;
        switch (data.require.name) {
            case 'ROLE':
                const requireRole = data.require.value;
                const rolePlayer = interaction.member.roles.cache;
                for (const role of requireRole) if (rolePlayer.has(role)) isOK = true;
                break;

            default:
                isOK = true;
                break;
        }

        if (!isOK) return interaction.user.send('Syarat tidak mencukupi!');
        data.entries.push(interaction.user.id);
        data.embed.fields[2].value = `${data.entries.length}`;

        await interaction.message.edit({ embeds: [data.embed] });
        await db.findOneAndUpdate({ messageID: interaction.message.id }, data);

        interaction.user.send('Telah mengikuti giveaway!');
    }
};