const { Client, Collection } = require("discord.js");
const Util = require("./util.js");

module.exports = class katopos extends Client {
  constructor(opt) {
    super(opt);

    this.util = new Util();
    this.commands = new Collection();
    this.cooldowns = new Collection();
    this.aliases = new Collection();
    this.config = require("../config.json");
    this.recent = new Set();
  }
};
