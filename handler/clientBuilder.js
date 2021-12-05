const { Client, Collection } = require('discord.js');
const KuromojiAnalyzer = require("kuroshiro-analyzer-kuromoji");
const Kuroshiro = require('@dsquare-gbu/kuroshiro');

const kuroshiro = new Kuroshiro();
(async () => await kuroshiro.init(new KuromojiAnalyzer()))();
module.exports = class katopos extends Client {
    constructor(opt) {
        super(opt);

        this.config = require('../config/config.json');
        this.util = new (require('./util'))();
        this.commands = new Collection();
        this.cooldowns = new Collection();
        this.aliases = new Collection();
        this.cacheAttachments = new Collection();
        this.recent = new Set();
        this.anime = {
            kusonime: new (require('../module/Anime/Kusonime'))(this),
            samehadaku: new (require('../module/Anime/Samehadaku'))(this)
        };
        this.trakteer = new (require('../module/Trakteer'))(this.config.trakteer);
        this.giveaway = new (require('../module/Giveaway'))(this);
        this.player = new (require('discord-player')).Player(this);
        this.kuroshiro = kuroshiro;
    };
};