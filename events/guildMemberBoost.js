const Client = require("../core/ClientBuilder");
const { GuildMember } = require("discord.js");
/**
 *
 * @param {Client} client
 * @param {GuildMember} member
 */
module.exports = (client, member) => {
  client.donatur.createBooster(member);

  require("../handler/boosterPoster")(client, member);
};
