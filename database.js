const { Client } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

const afk = db.table('afk');
const cmd = db.table('cmd');
const giveaway = db.table('giveaway');

/**
 * 
 * @param {Client} client 
 */
module.exports = (client) => {
    client.db = db;
    client.db.afk = afk;
    client.db.cmd = cmd;
    client.db.giveaway = giveaway;

    return client.db;
}