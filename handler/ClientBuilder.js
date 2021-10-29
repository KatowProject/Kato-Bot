const { Client, Collection } = require("discord.js");
const { Player } = require('discord-player');
const Util = require("./util");
const { Kusonime, Samehadaku, AnimeBatchs } = require('./AnimeClass');
const Drakor = require('./Drakor');
const Trakteer = require('../module/trakteer-scraper/index');
const Genius = require('genius-lyrics');

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
    this.dataAttachment = new Collection();
    this.recent = new Set();
    this.player = new Player(new Client());
    this.samehadaku = new Samehadaku(this);
    this.kusonime = new Kusonime(this);
    this.drakor = new Drakor(this);
    this.animebatchs = new AnimeBatchs(this);
    this.trakteer = new Trakteer(this.config.trakteer);
    this.genius = new Genius.Client();
  };
};
