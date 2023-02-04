const { Client } = require('discord.js');
const { Queue, StreamDispatcher } = require('discord-player');

/**
 * Emitted when a connection is created.
 * @param {Client} client 
 * @param {Queue} queue 
 * @param {StreamDispatcher} connection 
 */
module.exports = async (client, queue, connection) => {
    console.log(`Connection created in ${queue.guild.name} | ${queue.guild.id}`);
}