const { Client, Collection } = require('discord.js');
const KuromojiAnalyzer = require('kuroshiro-analyzer-kuromoji');
const Kuroshiro = require('@dsquare-gbu/kuroshiro');
const Kusonime = require('../modules/anime/kusonime');
const Util = require('./Util');
const Trakteer = require('./trakteer');
const DonaturManager = require('./donaturManager');
const Giveaway = require('../modules/Giveaway');
const KatoShop = require('../modules/Special-Event');
const Selfbot = require('../modules/Discord-Selfbot');
const Form = require('../modules/Discord-Form');

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
        this.giveaway = new Giveaway(this, process.env.GIVEAWAY_TIME_INTERVAL);
        this.katoShop = new KatoShop(this);
        this.form = new Form(this);
        this.selfbot = new Selfbot(process.env.SELFBOT_TOKEN.split(',').map(x => x.trim()));

        this.kuroshiro.init(new KuromojiAnalyzer());
        this.donaturManager.init();
        this.giveaway.init();
        this.katoShop.init();
        this.trakteer.init(process.env.TRAKTEER_XSRF_TOKEN, process.env.TRAKTEER_ID_SESSION);
        this.selfbot.init(true);
        this.form.init();

        // this.trakteer.webhookNotification(true, process.env.TRAKTEER_LOGS_WEBHOOK, 60_000);

        setInterval(() => require('../modules/MEE6-Leaderboard/')(this), 360_000);
    }
}