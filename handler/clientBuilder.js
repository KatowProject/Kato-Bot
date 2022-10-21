const { Client, Collection } = require('discord.js');
const config = require('../config/config.json');
const KuromojiAnalyzer = require("kuroshiro-analyzer-kuromoji");
const Kuroshiro = require('@dsquare-gbu/kuroshiro');
const Selfbot = require('../module/Discord-Selfbot/index.js');
const TempEvent = require('../module/Temp-Event/tempEvent.js');
const kuroshiro = new Kuroshiro();
const selfbot = new Selfbot(config.selfbot);
(async () => {
    await kuroshiro.init(new KuromojiAnalyzer());
    await selfbot.init(true);
})();
module.exports = class katopos extends Client {
    constructor(opt) {
        super(opt);

        this.config = config;
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
        this.selfbot = selfbot;
        this.canvas = new (require('../module/Discord-Canvas'))(this);
        this.tempEvent = new TempEvent({
            client: this,
            interval: 30_000,
            messageCount: 150,
            isOpen: true,
            channel: '932997960923480099'
        });
    };
};