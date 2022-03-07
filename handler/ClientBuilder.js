const { Client, Collection } = require("discord.js");
const { Player } = require('discord-player');
const Util = require("./util");
const Samehadaku = require('./Samehadaku.js');
const Kusonime = require('./Kusonime.js');
const Giveaway = require('../plugin/giveaway');

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
    this.cacheAttachments = new Collection();
    this.recent = new Set();
    this.player = new Player(this);
    this.samehadaku = new Samehadaku(this);
    this.kusonime = new Kusonime(this);
    this.giveaway = new Giveaway(this);
  }
};
