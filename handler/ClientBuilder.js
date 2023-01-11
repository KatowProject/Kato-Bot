const { Client, Collection } = require('discord.js');
const KuromojiAnalyzer = require('kuroshiro-analyzer-kuromoji');
const Kuroshiro = require('@dsquare-gbu/kuroshiro');
const Kusonime = require('../modules/anime/kusonime');
const Util = require('./Util');
const kuroshiro = new Kuroshiro();
kuroshiro.init(new KuromojiAnalyzer());

module.exports = class Kato extends Client {
    constructor(opt) {
        super(opt);
        this.util = new Util();
        this.commands = new Collection();
        this.cooldowns = new Collection();
        this.aliases = new Collection();
        this.cache = new Collection();
        this.kuroshiro = kuroshiro;
        this.kusonime = new Kusonime(this);
    }
}