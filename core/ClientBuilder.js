const { Client, Collection } = require("discord.js");

const Util = require("../helper/util");
const config = require("../config/environment.json");

const Giveaway = require("../modules/Giveaway");
const Selfbot = require("../modules/Discord-Selfbot");
const DonaturManager = require("../modules/Donatur");
const TrakteerScraper = require("../handler/trakteer");
const TrakteerWrapper = require("../modules/Trakteer-Wrapper");

class Kato extends Client {
  constructor(opt) {
    super(opt);

    this.config = config;
    this.util = new Util();
    this.commands = new Collection();
    this.aliases = new Collection();
    this.helps = new Collection();
    this.cache = new Collection();

    this.giveaway = new Giveaway(this, this.config.giveaway.interval);
    this.selfbot = new Selfbot(this.config.selfbot);
    this.donatur = new DonaturManager(this);
    this.trakteer = new TrakteerScraper();
    this.wTrakteer = new TrakteerWrapper(this.config.trakteer.token);

    this.init();
  }

  init() {
    require("./events")(this);
    require("./module")(this);
    require("./database")(this.config.database.uri);
    require("discord-logs")(this);

    this.selfbot.init(true);
    this.giveaway.init();
    this.donatur.init();
    this.trakteer.init(
      this.config.trakteer["xsrf-token"],
      this.config.trakteer["trakteer-sess"]
    );

    setInterval(() => require("../modules/Mee6")(), 600000);
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
 