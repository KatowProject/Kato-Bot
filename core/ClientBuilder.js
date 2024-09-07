const { Client, Collection } = require("discord.js");

const Util = require("../helper/util");
const config = require("../config/environment.json");

class Kato extends Client {
  constructor(opt) {
    super(opt);

    this.config = config;
    this.util = new Util();
    this.commands = new Collection();
    this.aliases = new Collection();
    this.helps = new Collection();
    this.cache = new Collection();

    this.init();
  }

  init() {
    require("./events")(this);
    require("./module")(this);
    require("./database")(this.config.database.uri);
    require("discord-logs")(this);
  }

  async login() {
    try {
      if (config.is_production) {
        super.login(this.config.discord.token);
      } else {
        super.login(this.config.discord.token_dev);
      }
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Kato;
