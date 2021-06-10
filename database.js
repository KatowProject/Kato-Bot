const db = require('quick.db');

const log = new db.table('log');
const afk = new db.table('afk');
const elm = new db.table('elm');
const cmd = new db.table('cmd');
const mute = new db.table('mute');
const ar = new db.table('ARs');

module.exports = { log, afk, elm, cmd, mute, ar };