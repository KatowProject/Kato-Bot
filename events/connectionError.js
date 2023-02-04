const { Client } = require('discord.js');
const { Queue } = require('discord-player');

/**
 * Emitted when a connection is created.
 * @param {Client} client 
 * @param {Queue} queue 
 * @param {Error} connection 
 */
module.exports = async (client, queue, err) => {
    console.log(err);
    console.log(`Connection error in ${queue.guild.name} | ${queue.guild.id}`);
}