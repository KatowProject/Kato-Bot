const { Client, Collection } = require('discord.js');
const KuromojiAnalyzer = require('kuroshiro-analyzer-kuromoji');
const Kuroshiro = require('@dsquare-gbu/kuroshiro');
const Kusonime = require('../modules/anime/kusonime');
const Util = require('./Util');
const Trakteer = require('./trakteer');
const DonaturManager = require('./donaturManager');

module.exports = class Kato extends Client {
    constructor(opt) {
        super(opt);
        this.util = new Util();
        this.commands = new Collection();
        this.cooldowns = new Collection();
        this.aliases = new Collection();
        this.cache = new Collection();
        this.kuroshiro = new Kuroshiro();
        this.kusonime = new Kusonime(this);
        this.trakteer = new Trakteer(this);
        this.donaturManager = new DonaturManager(this);

        this.kuroshiro.init(new KuromojiAnalyzer());
        this.donaturManager.init();
    }
}