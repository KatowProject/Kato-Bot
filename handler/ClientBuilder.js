const { Client, Collection } = require("discord.js");
const Util = require("./util");

module.exports = class katopos extends Client {

  constructor(opt) {
    super(opt);

    this.config = require("../config/config.json");
    this.emoji = require('../config/emoji.json');
    this.warna = require('../config/colors.json');
    this.util = new Util();
    this.commands = new Collection();
    this.cooldowns = new Collection();
    this.aliases = new Collection();
    this.recent = new Set();

  }

};
