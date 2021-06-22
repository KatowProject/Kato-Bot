const ms = require('ms');
const donate = require('../database/schema/Donatur');


module.exports = async (client, message) => {

    const embeds = message.embeds[0].fields;

    const tag = embeds[0].value;
    const unit = embeds[1].value;
    let supportID = embeds[3].value.split(' ');
    const duration = embeds[4].value;


    const userRegex = new RegExp(tag, "i");
    const findTag = message.guild.members.cache.find(a => {
        return userRegex.test(a.user.tag) ? userRegex.test(a.user.tag) : false;
    });

    let id = null;
    supportID.forEach(a => {
        if (parseInt(a)) return id = a;
    });
    const findID = message.guild.members.cache.get(id);

    const value = findTag ? 'tag' : findID ? 'id' : false;
    switch (value) {
        case 'tag':
            const durasiTag = ms(parseInt(duration) + 'd');
            const alreadyDonaturTag = await donate.findOne({ userID: findTag.id });

            if (alreadyDonaturTag) {

                await donate.findOneAndUpdate({ userID: findTag.id }, { userID: findTag.id, guild: message.guild.id, duration: alreadyDonaturTag.duration + durasiTag, now: alreadyDonaturTag.now });
                // await table.set(findTag.id, { dur: alreadyDonaturTag.dur + durasiTag, first: alreadyDonaturTag.first, guild: message.guild.id });
                await findTag.roles.add('438335830726017025');
                client.channels.cache.get('336877836680036352').send('Hai para staff, ada Donatur Aktif yang donasi lagi. Durasi Role diperpanjang secara otomatis oleh bot, segera cek kembali ya untuk memastikan!');

            } else {

                await donate.create({ userID: findTag.id, guild: message.guild.id, duration: durasiTag, now: Date.now() });
                //await table.set(findTag.id, { dur: durasi, first: Date.now(), guild: message.guild.id });
                await findTag.roles.add('438335830726017025');
                client.channels.cache.get('336877836680036352').send('Hai Para Staff, ada donatur yang telah berhasil dipasangkan rolenya, coba segera cek kembali bisa saja tidak terpasang🥰');

            }
            break;

        case 'id':
            const durasiID = ms(parseInt(duration) + 'd');
            const alreadyDonaturID = await donate.findOne({ userID: findID.id });

            if (alreadyDonaturID) {

                await donate.findOneAndUpdate({ userID: findID.id }, { userID: findID.id, guild: message.guild.id, duration: alreadyDonaturID.duration + durasiID, now: alreadyDonaturID.now });
                //await table.set(findID.id, { dur: alreadyDonaturID.dur + durasiID, first: alreadyDonaturID.first, guild: message.guild.id });
                client.channels.cache.get('336877836680036352').send('Hai para staff, ada Donatur Aktif yang donasi lagi. Durasi Role diperpanjang secara otomatis oleh bot, segera cek kembali ya untuk memastikan!');

            } else {

                await donate.create({ userID: findID.id, guild: message.guild.id, duration: durasiID, now: Date.now() });
                // await table.set(findID.id, { dur: durasi, first: Date.now(), guild: message.guild.id });
                await findID.roles.add('438335830726017025');
                client.channels.cache.get('336877836680036352').send('Hai Para Staff, ada donatur yang telah berhasil dipasangkan rolenya, coba segera cek kembali bisa saja tidak terpasang🥰');

            }
            break;

        default:
            client.channels.cache.get('336877836680036352').send('Hai Para Staff, ada Donatur yang tidak terpasang secara otomatis silahkan berikan sesuai dengan log terbaru di <#831475856882925629>');
            break;

    }
}