const { Client, Collection } = require('discord.js');
const Util = require('./Util');

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
    }
}

module.exports = Kato;