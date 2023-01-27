const { Client, Collection } = require('discord.js');
const KuromojiAnalyzer = require('kuroshiro-analyzer-kuromoji');
const Kuroshiro = require('@dsquare-gbu/kuroshiro');
const Kusonime = require('../modules/anime/kusonime');
const Util = require('./Util');
const Trakteer = require('./trakteer');
const DonaturManager = require('./donaturManager');
const Canvas = require('../modules/Discord-Canvas');
const Giveaway = require('../modules/Giveaway');
const KatoShop = require('../modules/Special-Event');
const Selfbot = require('../modules/Discord-Selfbot');

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
        this.canvas = new Canvas();
        this.giveaway = new Giveaway(this, process.env.GIVEAWAY_TIME_INTERVAL);
        this.katoShop = new KatoShop(this);
        this.selfbot = new Selfbot(process.env.SELFBOT_TOKEN.split(',').map(x => x.trim()));

        this.kuroshiro.init(new KuromojiAnalyzer());
        this.donaturManager.init();
        this.giveaway.init();
        this.katoShop.init();
        this.selfbot.init(true);
        //this.trakteer.getNotification(true, 30_000);
        setInterval(() => require('../modules/MEE6-Leaderboard/')(this), 120_000);
    }
}