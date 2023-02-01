const { Client, ActivityType } = require('discord.js');
/**
 * 
 * @param {Client} client 
 */
module.exports = client => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity({ name: "Kato", type: ActivityType.Competing });
    client.user.setStatus('dnd');
}