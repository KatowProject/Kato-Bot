const db = require('../database/schema/Giveaway');
const dbUser = require('../database/schema/event');

module.exports = async (client, reaction, user) => {
    const message = reaction.message;

    const Giveawaydata = await db.findOne({ messageID: message.id });
    if (!Giveawaydata) return;

    const fetchMessage = await message.channel.fetch(message.id);
    if (!fetchMessage) return;

    const userData = await dbUser.findOne({ userID: user.id });
    if (!userData) return;

    if (userData.isParticipant) return user.send('You are already a participant of this giveaway!');
    //await dbUser.findOneAndUpdate({ userID: user.id }, { isParticipant: true, ticket: userData.ticket - Giveawaydata.tickets });
    message.channel.send(`${user.username} has joined the giveaway!`);

}