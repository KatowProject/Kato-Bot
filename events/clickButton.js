const db = require('../database/schema/Giveaway');
const dbUser = require('../database/schema/event');

module.exports = async (client, button) => {
    if (button.id == 'giveawayEvent') {
        button.reply.defer();

        let isOK = null;
        const data = await db.findOne({ messageID: button.message.id });
        const dataUser = await dbUser.findOne({ userID: button.clicker.user.id });

        if (!data || !dataUser) return button.clicker.user.send('Kamu tidak terdaftar dalam event ini!');
        if (data.isDone) return button.clicker.user.send('Giveaway telah berakhir!');
        if (data.entries.includes(button.clicker.user.id)) return button.clicker.user.send('Sudah terdaftar dalam Giveaway!');

        dataUser.ticket >= data.require ? isOK = true : isOK = false;
        if (!isOK) return button.clicker.user.send('Syarat tidak mencukupi!');
        dataUser.ticket = dataUser.ticket -= data.require;

        data.entries.push(button.clicker.user.id);
        data.embed.fields[2].value = data.entries.length;

        button.message.edit({ embed: data.embed });
        await db.findOneAndUpdate({ messageID: button.message.id }, data);
        await dbUser.findOneAndUpdate({ userID: button.clicker.user.id }, dataUser);

        button.clicker.user.send('Berhasil Mengikuti Giveaway!');
    }

    if (button.id == 'acceptID') {
        button.reply.defer();

        const embeds = button.message.embeds[0];
        const data = embeds.description.split('\n');
        const id = data[2].split(' ')[1];
        const item = data[3].split(':')[1].trim();

        const getUser = await dbUser.findOne({ userID: id });
        if (!getUser) return button.clicker.user.send('User tidak terdaftar!');
        const getItem = getUser.items.find(a => a.name === item);
        if (!getItem) return button.clicker.user.send('Item tidak ditemukan!');
        if (getItem.used) return client.channels.cache.get('894853662629834772').send(`${button.clicker.user.username} telah menggunakan item ${item}!`);

        getItem.used = true;
        getItem.isPending = false;

        const getItemIndex = getUser.items.indexOf(getItem);
        getUser.items[getItemIndex] = getItem;

        await dbUser.findOneAndUpdate({ userID: id }, getUser);
        client.channels.cache.get('894853662629834772').send('Berhasil Menerima Hadiah User!');
        client.users.cache.get(id).send('Berhasil Menerima Hadiah!');

        data[4] = data[4].replace('Menunggu', 'Selesai');
        embeds.description = data.join('\n');
        button.message.edit({ embed: embeds, buttons: [] });
    }
};