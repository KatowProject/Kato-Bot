const donate = require('../database/schema/Donatur');

module.exports = async (client) => {

    const donaturs = await donate.find({});
    for (const member of donaturs) {

        const timeLatest = Date.now() - member.now;
        if (timeLatest > member.duration) {

            console.log(true)
            await client.guilds.cache.get(member.guild).members.cache.get(member.userID).roles.remove('438335830726017025');
            await donate.findOneAndDelete({ userID: member.userID });
            client.channels.cache.find(a => a.name === 'staff-bot').send(true);

        }

    }

}