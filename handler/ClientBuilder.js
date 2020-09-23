const { Client, Collection } = require("discord.js");
const { Player } = require('discord-player');
const Util = require("./util");
const Komiku = require('../plugin/KomikuReader.js');
const MangaDex = require('../plugin/MangaDex.js');

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
    this.player = new Player(new Client());
    this.komiku = new Komiku(this);
    this.mangadex = new MangaDex(this);

  }
};
