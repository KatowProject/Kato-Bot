const mutee = require('../database/schema/MuteMembers');

module.exports = async (client) => {

    const donaturs = await mutee.find({});
    for (const member of donaturs) {

        const timeLatest = Date.now() - member.now;
        if (timeLatest > member.duration) {

            await client.guilds.cache.get(member.guild).members.cache.get(member.userID).roles.remove('430378151651049486');
            await mutee.findOneAndDelete({ userID: member.userID });
            client.channels.cache.find(a => a.name === 'staff-bot').send(true);

        }

    }

}