const { Message, EmbedBuilder } = require("discord.js");
const Client = require("../../core/ClientBuilder");

const DiscordProductComponent = require("../../modules/Kato-Shop/discord/products");
const DiscordOptionComponent = require("../../modules/Kato-Shop/discord/options");

/**
 * @param {Client} client
 * @param {Message} message
 * @param {Array} args
 */
exports.run = async (client, message, args) => {
  const type = args[0];

  switch (type) {
    case "product":
      {
        const mProduct = new DiscordProductComponent(client, message);
        mProduct.init();
      }
      break;

    case "option":
      {
        const mOption = new DiscordOptionComponent(client, message);
        mOption.init();
      }
      break;

    default:
      {
        const embed = new EmbedBuilder()
          .setTitle("Manager Command List")
          .setDescription(`
            **product** - Manage products
            **option** - Manage optionss
            `)
          .setColor("Random")
          .setTimestamp()
          .setFooter({
            text: "Kato Shop",
            iconURL: client.user.displayAvatarURL(),
          });

        message.reply({
          embeds: [embed],
        });
      }
      break;
  }
};

exports.conf = {
  aliases: [],
  cooldown: 5,
  location: __filename,
};

exports.help = {
  name: "manage",
  description: "manage products",
  usage: "manage",
  example: "manage",
};
