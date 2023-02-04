const { Client, Collection } = require('discord.js');
const { Player } = require('discord-player');
const Util = require('./Util');
const Giveaway = require('./Giveaway');
const Database = require('../database');

class Kato extends Client {
    /**
     * @param {ClientOptions} options
     */
    constructor(options) {
        super(options);

        this.util = new Util();
        this.commands = new Collection();
        this.aliases = new Collection();
        this.cooldowns = new Collection();
        this.aliases = new Collection();
        this.db = Database(this);
        this.giveaway = new Giveaway(this);
        this.player = new Player(this);
        this.giveaway.init();
    }
}

module.exports = Kato;