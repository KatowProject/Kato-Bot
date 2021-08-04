const db = require('../database').ga;

module.exports = async (client, button) => {
    if (button.id !== 'giveawayID') return;
    button.reply.defer();

    const data = db.fetch(button.message.id);
    if (data) {
        if (data.entries.includes(button.clicker.user.id)) return button.clicker.user.send('Sudah terdaftar dalam Giveaway!');

        data.entries.push(button.clicker.user.id);
        data.embed.fields[1].value = data.entries.length;

        button.message.edit({ embed: data.embed });
        db.set(button.message.id, data);

        button.clicker.user.send('Berhasil Mengikuti Giveaway!');
    };
};