const Client = require("../../core/ClientBuilder");
const {
  Message,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");
const ms = require("ms");

/**
 *
 * @param {Client} client
 * @param {Message} message
 * @param {[]} args
 */
exports.run = async (client, message, args) => {
  if (!message.member.permissions.has("ManageMessages"))
    return message.reply("Not Enough Permission!");

  const option = args[0]?.toLowerCase() || null;
  switch (option) {
    case "apply":
      {
        const duration = args[1];
        const id = args[2] ?? "";

        const member =
          message.mentions.members.first() ||
          message.guild.members.cache.get(id);
        if (!member) return message.reply("User not found!");

        const btnAccept = new ButtonBuilder()
          .setStyle(ButtonStyle.Primary)
          .setLabel("Accept")
          .setCustomId(`donatur_accept_${message.id}`);

        const btnReject = new ButtonBuilder()
          .setStyle(ButtonStyle.Danger)
          .setLabel("Reject")
          .setCustomId(`donatur_reject_${message.id}`);

        const row = new ActionRowBuilder().addComponents(btnAccept, btnReject);

        if (duration === "booster") {
          const msg = await message.reply({
            embeds: [
              new EmbedBuilder()
                .setColor("Random")
                .setAuthor({
                  name: message.guild.name,
                  iconURL: message.guild.iconURL({ dynamic: true, size: 4096 }),
                })
                .addFields(
                  { name: "Waktu:", value: `No Time (Booster)`, inline: true },
                  { name: "Tag: ", value: `${member.user.tag}`, inline: true },
                  {
                    name: "Nickname:",
                    value: `${member.nickname}`,
                    inline: true,
                  }
                )
                .setFooter({
                  text: `ID: ${member.id}`,
                  iconURL: member.user.avatarURL({ dynamic: true, size: 4096 }),
                }),
            ],
            components: [row],
          });

          const filter = (i) =>
            i.user.id === message.author.id &&
            i.customId.startsWith("donatur_");
          const collector = msg.createMessageComponentCollector({
            filter,
            time: 60000,
          });

          collector.on("collect", async (i) => {
            switch (i.customId.split("_")[1]) {
              case "accept":
                await client.donatur.createBooster(member);
                i.update({
                  embeds: [
                    new EmbedBuilder()
                      .setColor("Green")
                      .setDescription("Donatur Booster has been created!"),
                  ],
                  components: [],
                });
                break;
              case "reject":
                i.update({
                  embeds: [
                    new EmbedBuilder()
                      .setColor("Red")
                      .setDescription("Donatur Booster has been rejected!"),
                  ],
                  components: [],
                });
                break;
            }
          });
        } else {
          const time = ms(duration);
          if (!time) return message.reply("Invalid Time!");

          const msg = await message.reply({
            embeds: [
              new EmbedBuilder()
                .setColor("Random")
                .setAuthor({
                  name: message.guild.name,
                  iconURL: message.guild.iconURL({ dynamic: true, size: 4096 }),
                })
                .addFields(
                  {
                    name: "Waktu:",
                    value: `${client.util.parseDur(time)}`,
                    inline: true,
                  },
                  { name: "Tag: ", value: `${member.user.tag}`, inline: true },
                  {
                    name: "Nickname:",
                    value: `${member.nickname}`,
                    inline: true,
                  }
                )
                .setFooter({
                  text: `ID: ${member.id}`,
                  iconURL: member.user.avatarURL({ dynamic: true, size: 4096 }),
                }),
            ],
            components: [row],
          });

          const filter = (i) =>
            i.user.id === message.author.id &&
            i.customId.startsWith("donatur_");

          const collector = msg.createMessageComponentCollector({
            filter,
            time: 60000,
          });

          collector.on("collect", async (i) => {
            switch (i.customId.split("_")[1]) {
              case "accept":
                await client.donatur.createDonatur(member, time);
                i.update({
                  embeds: [
                    new EmbedBuilder()
                      .setColor("Green")
                      .setDescription("Donatur has been created!"),
                  ],
                  components: [],
                });
                break;
              case "reject":
                i.update({
                  embeds: [
                    new EmbedBuilder()
                      .setColor("Red")
                      .setDescription("Donatur has been rejected!"),
                  ],
                  components: [],
                });
                break;
            }
          });
        }
      }
      break;
    case "status":
      {
        if (args.includes("--all")) {
          const leftArrow = new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setLabel("⬅️")
            .setCustomId(`donatur_list_left_${message.id}`);

          const deleteButton = new ButtonBuilder()
            .setStyle(ButtonStyle.Danger)
            .setLabel("🗑️")
            .setCustomId(`donatur_list_delete_${message.id}`);

          const rightArrow = new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setLabel("➡️")
            .setCustomId(`donatur_list_right_${message.id}`);

          const row = new ActionRowBuilder().addComponents(
            leftArrow,
            deleteButton,
            rightArrow
          );

          const donaturs = await client.donatur.getDonatur(message.guild.id);
          if (donaturs.length < 1) return message.reply("No Donatur found!");

          const donaturList = donaturs.map((donatur, i) => {
            const timeLeft =
              donatur.time.duration - (Date.now() - donatur.time.now);
            const durasi = client.util.parseDur(timeLeft);

            return `**${i + 1}. <@${donatur.userID}>** \`[${
              donatur.isBooster ? "Booster" : durasi
            }]\``;
          });

          let pagination = 1;
          const chunkDonaturs = client.util.chunk(donaturList, 10);

          const embed = new EmbedBuilder()
            .setColor("Random")
            .setAuthor({
              name: message.guild.name,
              iconURL: message.guild.iconURL({ dynamic: true, size: 4096 }),
            })
            .setTitle("Donatur List")
            .setDescription(chunkDonaturs[pagination - 1].join("\n"))
            .setFooter({
              text: `Page ${pagination} of ${chunkDonaturs.length}`,
              iconURL: message.guild.iconURL({ dynamic: true, size: 4096 }),
            });

          const msg = await message.reply({
            embeds: [embed],
            components: [row],
          });

          const filter = (i) =>
            i.user.id === message.author.id &&
            i.customId.startsWith("donatur_list_");

          const collector = msg.createMessageComponentCollector({
            filter,
            time: 60000,
          });

          collector.on("collect", async (i) => {
            i.deferUpdate();
            console.log(i.customId.split("_")[2]);
            switch (i.customId.split("_")[2]) {
              case "left":
                if (pagination === 1) return;
                pagination--;
                break;
              case "right":
                if (pagination === chunkDonaturs.length) return;
                pagination++;
                break;
              case "delete":
                msg.delete();
                break;
            }

            if (i.customId.split("_")[2] === "delete") {
              collector.stop();
              return;
            }

            embed.setDescription(chunkDonaturs[pagination - 1].join("\n"));
            embed.setFooter({
              text: `Page ${pagination} of ${chunkDonaturs.length}`,
              iconURL: message.guild.iconURL({ dynamic: true, size: 4096 }),
            });

            msg.edit({ embeds: [embed], components: [row] });
          });
        } else {
          const donatur = await client.donatur.getDonaturById(
            message.author.id
          );
          if (!donatur) return message.reply("You're not a donatur!");

          const timeLeft =
            donatur.time.duration - (Date.now() - donatur.time.now);
          const durasi = client.util.parseDur(timeLeft);

          const embed = new EmbedBuilder()
            .setColor("Random")
            .setAuthor({
              name: message.guild.name,
              iconURL: message.guild.iconURL({ dynamic: true, size: 4096 }),
            })
            .setTitle("Donatur Information")
            .addFields(
              { name: "Tag: ", value: `${message.author.tag}`, inline: true },
              {
                name: "Nickname:",
                value: `${message.member.nickname}`,
                inline: true,
              },
              { name: "Durasi:", value: `${durasi}`, inline: true }
            )
            .setFooter({
              text: `ID: ${message.author.id}`,
              iconURL: message.author.avatarURL({ dynamic: true, size: 4096 }),
            });

          message.reply({ embeds: [embed] });
        }
      }
      break;

    case "xp":
      {
        const donaturs = await client.donatur.getDonatur(message.guild.id);

        const sort = donaturs.sort((a, b) => b.message.daily - a.message.daily);
        const map = sort.map(
          (x, i) =>
            `**${i + 1}.** <@${x.userID}> | \`${x.userID}\` **[${
              x.message.daily
            } Message | ${x.message.daily * 10 * 0.25} XP]**`
        );
        const chunk = client.util.chunk(map, 10);

        let pagination = 1;
        const embed = new EmbedBuilder()
          .setTitle("XP Bonus List")
          .setAuthor({
            name: message.guild.name,
            iconURL: message.guild.iconURL(),
          })
          .setColor("#0099ff")
          .setDescription(chunk[pagination - 1].join("\n"))
          .setFooter({ text: `Page ${pagination} of ${chunk.length}` });

        const btn = [
          new ButtonBuilder()
            .setLabel("< Back")
            .setStyle(ButtonStyle.Secondary)
            .setCustomId(`back-${message.id}`),
          new ButtonBuilder()
            .setLabel("🗑️")
            .setStyle(ButtonStyle.Danger)
            .setCustomId(`delete-${message.id}`),
          new ButtonBuilder()
            .setLabel("> Next")
            .setStyle(ButtonStyle.Secondary)
            .setCustomId(`next-${message.id}`),
        ];
        const m = await message.channel.send({
          embeds: [embed],
          components: [new ActionRowBuilder().addComponents(btn)],
        });
        const collector = m.channel.createMessageComponentCollector({
          filter: (msg) => msg.user.id === message.author.id,
          time: 60_000,
        });
        collector.on("collect", async (msg) => {
          await msg.deferUpdate();

          switch (msg.customId) {
            case `back-${message.id}`:
              if (pagination === 1) return;
              pagination--;
              embed.setDescription(chunk[pagination - 1].join("\n"));
              embed.setFooter({
                text: `Page ${pagination} of ${chunk.length}`,
              });
              m.edit({
                embeds: [embed],
                components: [new ActionRowBuilder().addComponents(btn)],
              });
              break;
            case `next-${message.id}`:
              if (pagination === chunk.length) return;
              pagination++;
              embed.setDescription(chunk[pagination - 1].join("\n"));
              embed.setFooter({
                text: `Page ${pagination} of ${chunk.length}`,
              });
              m.edit({
                embeds: [embed],
                components: [new ActionRowBuilder().addComponents(btn)],
              });
              break;
            case `delete-${message.id}`:
              await m.delete();
              break;
          }
        });
      }
      break;
    default:
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Donatur Command")
            .setDescription(
              "```js\n" +
                `apply <duration> <user>\n` +
                `status [--all]\n` +
                `xp\n` +
                "```" +
                "Contoh penggunaan: `donatur apply 1d @user`"
            )
            .setColor("Random")
            .setFooter({
              text: "Donatur System",
              iconURL: message.guild.iconURL({ dynamic: true, size: 4096 }),
            }),
        ],
      });
  }
};

exports.conf = {
  aliases: ["dn"],
  cooldown: 5,
};

exports.help = {
  name: "donatur",
  description: "Manage donatur",
  usage: "donatur <apply|status> [user]",
  example: "donatur apply @user",
};
