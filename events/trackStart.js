const { Client } = require('discord.js');
const { Queue, Track } = require('discord-player');

/**
 * Emitted when a track starts.
 * @param {Client} client 
 * @param {Queue} queue 
 * @param {Track} track 
 */
module.exports = async (client, queue, track) => {
    queue.metadata.channel.send(`Now playing ${track.title}...`);
}