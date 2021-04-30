const ms = require('ms');
const db = require('quick.db');

module.exports = async (client, message) => {

    const embeds = message.embeds[0].fields;

    const tag = embeds[0].value;
    const unit = embeds[1].value
    let supportID = embeds[2].value.split(' ');
    const duration = embeds[3].value;


    const userRegex = new RegExp(tag, "i");
    let findTag = message.guild.members.cache.find(a => {
        return userRegex.test(a.user.tag) ? userRegex.test(a.user.tag) : false
    })

    if (!findTag) {

        let id;
        supportID.forEach(a => {
            const parse = parseInt(a);
            if (parse) id = parse;
        });
        idRegex = new RegExp(id, "i");

        let findID = message.guild.members.cache.find(a => userRegex.test(a.id) ? userRegex.test(a.id) : false);
        if (!findID) return client.channels.cache.get('336877836680036352').send('Hai Para Staff, ada Donatur yang tidak terpasang secara otomatis silahkan berikan sesuai dengan log terbaru di <#831475856882925629>');
        else {

            let table = new db.table('Dons');
            let durasi = ms(parseInt(duration) + 'd');
            await table.set(findID.id, { dur: durasi, first: Date.now(), guild: message.guild.id });
            await findID.roles.add('438335830726017025').then(() => {
                client.channels.cache.get('336877836680036352').send('Hai Para Staff, ada donatur yang telah berhasil dipasangkan rolenya, coba segera cek kembali bisa saja tidak terpasang🥰');

            })

        };

    } else {

        let table = new db.table('Dons');
        let durasi = ms(parseInt(duration) + 'd');
        await table.set(findTag.id, { dur: durasi, first: Date.now(), guild: message.guild.id });
        await findTag.roles.add('438335830726017025').then(() => {
            client.channels.cache.get('336877836680036352').send('Hai Para Staff, ada donatur yang telah berhasil dipasangkan rolenya, coba segera cek kembali bisa saja tidak terpasang🥰');

        })
    }

}