const db = require('quick.db');

module.exports = async (client) => {

    let table = new db.table("UNs");
    let data = table.all();
    if (data.length < 1) return;

    for (let i = 0; i < data.length; i++) {
        let member = table.get(data[i].ID);
        let timeLatest = Date.now() - member.first;
        if (timeLatest > member.dur) {
            await client.guilds.cache.get(member.guild).members.cache.get(data[i].ID).roles.remove('430378151651049486');
            console.log('Telah mencabut role Muted dan Menghapus database!');
            table.delete(data[i].ID);

        } else return;
    }
}