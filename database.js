const db = require('quick.db');

const afk = new db.table('afk');
const cmd = new db.table('cmd');
const ga = new db.table('ga');

module.exports = { afk, cmd, ga };