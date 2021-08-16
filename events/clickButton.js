const db = require('../database/schema/Giveaway');
const dbxp = require('../database/schema/xp_player');

module.exports = async (client, button) => {
    if (button.id !== 'giveawayID2') return;
    button.reply.defer();

    const data = await db.findOne({ messageID: button.message.id });
    const xps = await dbxp.findOne({ id: 1 });
    if (!xps) return;
    if (data.isDone) return button.clicker.user.send('Giveaway telah berakhir!');

    if (data) {

        if (data.entries.includes(button.clicker.user.id)) return button.clicker.user.send('Sudah terdaftar dalam Giveaway!');
        let isOK = null;
        switch (data.require.name) {
            case 'MEE6':
                const xpPlayers = xps.data;
                const player = xpPlayers.find(a => a.id === button.clicker.user.id);
                if (!player) return button.clicker.user.send('Tidak dapat mengikuti karna Level tidak mencukupi!');
                const requireLevel = parseInt(data.require.value);

                if (player.level <= requireLevel) isOK = false;
                isOK = true;
                break;
            case 'Roles':
                const requireRole = data.require.value;
                const rolePlayer = button.clicker.member.roles.cache;
                for (const role of requireRole) if (rolePlayer.has(role)) isOK = true;

                break;
        };

        if (!isOK) return button.clicker.user.send('Syarat tidak mencukupi!');

        data.entries.push(button.clicker.user.id);
        data.embed.fields[2].value = data.entries.length;

        button.message.edit({ embed: data.embed });
        await db.findOneAndUpdate({ messageID: button.message.id }, data);

        button.clicker.user.send('Berhasil Mengikuti Giveaway!');
    };
};