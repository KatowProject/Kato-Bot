const Client = require("../core/ClientBuilder");
const { EmbedBuilder } = require("discord.js");
/**
 *
 * @param {Client} client
 * @param {Object} donatur
 */
module.exports = (client, donatur) => {
  if (donatur.type === "createBooster") {
    switch (donatur.status) {
      case "success":
        donatur.data.user.send({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: donatur.data.guild.name,
                iconURL: donatur.data.guild.iconURL({ dynamic: true }),
              })
              .setTitle("New Donatur Booster")
              .setColor("Green")
              .setDescription(
                `Terima kasih telah menjadi donatur di server kami, ${donatur.data.user.user.tag}!`
              )
              .setFooter({
                text: `Donatur Booster | ${donatur.data.user.user.tag}`,
                iconURL: donatur.data.user.user.displayAvatarURL({
                  dynamic: true,
                }),
              })
              .setTimestamp(),
          ],
        });

        break;

      case "error":
        console.error(donatur.error);
        break;
    }
  } else if (donatur.type === "createDonatur") {
    switch (donatur.status) {
      case "success":
        console.log(
          `User ${donatur.data.user.user.tag} is now a donatur in ${donatur.data.guild.name}`
        );

        donatur.data.user.send({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: donatur.data.guild.name,
                iconURL: donatur.data.guild.iconURL({ dynamic: true }),
              })
              .setTitle("New Donatur")
              .setColor("Green")
              .setDescription(
                `Terima kasih telah menjadi donatur di server kami, ${donatur.data.user.user.tag}!`
              )
              .setFooter({
                text: `Donatur | ${donatur.data.user.user.tag}`,
                iconURL: donatur.data.user.user.displayAvatarURL({
                  dynamic: true,
                }),
              })
              .setTimestamp(),
          ],
        });
        break;

      case "error":
        console.error(donatur.error);
        break;
    }
  } else if (donatur.type === "donaturDuration") {
    switch (donatur.status) {
      case "extend":
        donatur.data.user.send({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: donatur.data.guild.name,
                iconURL: donatur.data.guild.iconURL({ dynamic: true }),
              })
              .setTitle("Donatur Duration Extended")
              .setColor("Green")
              .setDescription(
                `Durasi donatur telah ditambahkan selama ${client.util.parseDur(
                  donatur.data.duration
                )} di server kami, ${donatur.data.user.user.tag}!`
              )
              .setFooter({
                text: `Donatur Extended | ${donatur.data.user.user.tag}`,
                iconURL: donatur.data.user.user.displayAvatarURL({
                  dynamic: true,
                }),
              })
              .setTimestamp(),
          ],
        });
        break;

      case "expired":
        donatur.data.user.send({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: donatur.data.guild.name,
                iconURL: donatur.data.guild.iconURL({ dynamic: true }),
              })
              .setTitle("Donatur Duration Expired")
              .setColor("Red")
              .setDescription(
                `Durasi donatur telah berakhir, terima kasih telah menjadi donatur di server kami, ${donatur.data.user.user.tag}!`
              )
              .setFooter({
                text: `Donatur Expired | ${donatur.data.user.user.tag}`,
                iconURL: donatur.data.user.user.displayAvatarURL({
                  dynamic: true,
                }),
              })
              .setTimestamp(),
          ],
        });
        break;

      case "error":
        console.error(donatur.error);
        break;
    }
  } else if (donatur.type === "dailyDonatur") {
    switch (donatur.status) {
      case "error":
        console.error(donatur.error);
        break;
    }
  }
};
