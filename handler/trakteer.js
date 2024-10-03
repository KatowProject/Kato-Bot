const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const moment = require("moment-timezone");
const Tr = require("../modules/trakteer-scraper/dist").default;

moment.tz.setDefault("Asia/Jakarta");

class Trakteer extends Tr {
  constructor(client) {
    super();

    this.client = client;
  }

  /**
   * Cek Saldo Donasi
   * @param {Message} message
   */
  async cekSaldo(message) {
    if (!message.member.permissions.has("ManageChannels")) return;
    const getSaldo = await this.getSaldo();
    const { saldo, current_donation } = getSaldo;
    const month = moment().format("MMMM");

    const rupiahSaldo = saldo.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
    });
    const rupiahDonasi = current_donation.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
    });

    const embed = new EmbedBuilder()
      .setTitle(`Donasi Bulan ${month}`)
      .setDescription(
        `**Saldo:** ${rupiahSaldo}\n**Donasi Bulan Ini:** ${rupiahDonasi}`
      )
      .setColor("Random")
      .setFooter({
        text: "trakteer.id/santai",
        iconURL: message.guild.iconURL(),
      });

    message.channel.send({ embeds: [embed] });
  }

  /**
   * Cek Data Donatur
   * @param {Message} message
   */
  async cekDonatur(message) {
    let { data, recordsTotal } = await this.getDonaturData();
    if (data.length < 1)
      return message.channel.send("Tidak ada data yang ditemukan!");

    let pagination = 1;
    const pages = Math.ceil(recordsTotal / 15);

    const donatur = data.map(
      (a, i) => `**${i + 1}. ${a.supporter}** | \`ID: ${a.id}\``
    );
    const embed = new EmbedBuilder()
      .setTitle("Data Donatur Perkumpulan Orang Santai")
      .setColor("Random")
      .setDescription(donatur.join("\n"))
      .setFooter({ text: "Pilih menggunakan angka untuk melanjutkan!" });

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("< Back")
        .setStyle(ButtonStyle.Secondary)
        .setCustomId(`back-${message.id}`),
      new ButtonBuilder()
        .setLabel("🗑️")
        .setStyle(ButtonStyle.Danger)
        .setCustomId(`delete-${message.id}`),
      new ButtonBuilder()
        .setLabel("Next >")
        .setStyle(ButtonStyle.Secondary)
        .setCustomId(`next-${message.id}`),
      new ButtonBuilder()
        .setLabel("Detail 📇")
        .setStyle(ButtonStyle.Secondary)
        .setCustomId(`detail-${message.id}`)
    );
    const r = await message.channel.send({
      embeds: [embed],
      components: [buttons],
    });
    const collector = r.channel.createMessageComponentCollector({
      filter: (msg) => msg.user.id === message.author.id,
      time: 60000,
    });
    collector.on("collect", async (m) => {
      await m.deferUpdate();
      switch (m.customId) {
        case `back-${message.id}`:
          if (pagination === 1) return;
          pagination--;

          data = await this.getDonaturData(pagination);
          embed.setDescription(
            data.data
              .map((a, i) => `**${i + 1}. ${a.supporter}** | \`ID: ${a.id}\``)
              .join("\n")
          );
          r.edit({ embeds: [embed], components: [buttons] });
          break;

        case `delete-${message.id}`:
          r.delete();
          break;

        case `next-${message.id}`:
          if (pagination === pages) return;
          pagination++;

          data = await this.getDonaturData(pagination);
          embed.setDescription(
            data.data
              .map((a, i) => `**${i + 1}. ${a.supporter}** | \`ID: ${a.id}\``)
              .join("\n")
          );

          r.edit({ embeds: [embed], components: [buttons] });
          break;
        case `detail-${message.id}`: {
          const msg = await message.channel.send(
            "Silahkan pilih data yang ingin dilihat!"
          );
          const awaitMessages = await message.channel.awaitMessages({
            filter: (msg) => msg.author.id === message.author.id,
            max: 1,
            time: 60_000,
            errors: ["time"],
          });
          let index = awaitMessages.first();
          if (!parseInt(data.content)) return msg.edit("Pilihan tidak valid!");

          data = await this.getOrderDetail(data.data[index - 1].id);
          if (!data) return msg.edit("Data tidak ditemukan!");

          msg.edit({
            content: "Detail Data",
            embeds: [
              new EmbedBuilder()
                .setColor("Random")
                .setTitle(`Detail Donasi ${data.nama}`)
                .addFields(
                  { name: "ID", value: data.orderId },
                  { name: "Nama", value: data.nama },
                  { name: "Nominal", value: data.nominal },
                  { name: "Tanggal", value: data.tanggal },
                  { name: "Pesan", value: data.message }
                )
                .setFooter({
                  text: "trakter.id/santai",
                  iconURL: message.guild.iconURL(),
                })
                .setTimestamp(),
            ],
          });
          break;
        }
      }
    });
  }

  /**
   *
   * @param {Message} message
   * @param {[]} args
   * @returns
   */
  async cekHistoryKas(message) {
    if (!message.member.permissions.has("MANAGE_GUILD")) return;
    let pagination = 1;

    const { recordsTotal, data } = await this.getHistory(pagination, 15);
    const pages = Math.ceil(recordsTotal / 15);

    const map = data.map(
      (a) =>
        `**${a.created_at}**\n\`${a.description}\` - **[${a.jumlah}] | [${a.current_balance}]**`
    );

    const embed = new EmbedBuilder()
      .setColor(`Aqua`)
      .setTitle("Pemasukan & Pengeluaran Kas")
      .setAuthor({
        name: message.guild.name,
        iconURL: message.guild.iconURL({ forceStatic: true, size: 4096 }),
      })
      .setDescription(map.join("\n"))
      .setFooter({ text: `Page ${pagination} of ${pages}` });

    const btn = [
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setLabel("< Back")
        .setCustomId(`back-${message.id}`),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setLabel("Next >")
        .setCustomId(`next-${message.id}`),
    ];

    const r = await message.channel.send({
      embeds: [embed],
      components: [new ActionRowBuilder().addComponents(btn)],
    });
    const collector = r.channel.createMessageComponentCollector({
      filter: (msg) => msg.user.id === message.author.id,
      time: 60_000,
    });
    collector.on("collect", async (msg) => {
      await msg.deferUpdate();

      switch (msg.customId) {
        case `back-${message.id}`: {
          if (pagination === 1) return;
          pagination--;

          const { data: back } = await this.getHistory(pagination, 15);
          const map_back = back.map(
            (a) =>
              `**${a.created_at}**\n\`${a.description}\` - **[${a.jumlah}] | [${a.current_balance}]**`
          );
          embed.setDescription(map_back.join("\n"));
          embed.setFooter({ text: `Page ${pagination} of ${pages}` });

          r.edit({
            embeds: [embed],
            components: [new ActionRowBuilder().addComponents(btn)],
          });
          break;
        }

        case `next-${message.id}`: {
          if (pagination === pages) return;
          pagination++;

          const { data: next } = await this.getHistory(pagination, 15);
          const map_next = next.map(
            (a) =>
              `**${a.created_at}**\n\`${a.description}\` - **[${a.jumlah}] | [${a.current_balance}]**`
          );
          embed.setDescription(map_next.join("\n"));
          embed.setFooter({ text: `Page ${pagination} of ${pages}` });

          r.edit({
            embeds: [embed],
            components: [new ActionRowBuilder().addComponents(btn)],
          });
          break;
        }
      }
    });
  }

  /**
   *
   * @param {Message} message
   * @param {[]} args
   */
  async leaderboard(message) {
    try {
      const lb = await this.getLeaderboard();
      console.log(lb);

      const monthName = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "Desember",
      ];
      const month = monthName[moment().month()];

      const data = lb.find((a) => a.title.includes(month));
      const map = data.supporter.map(
        (a, i) =>
          `**${i + 1}.** ${a.name} - <:santai:1099907159145332757> **${
            a.unit
          }x** Kesantaian`
      );
      const embed = new EmbedBuilder()
        .setColor(`Aqua`)
        .setTitle(`Leaderboard Donasi Bulan ${month}`)
        .setAuthor({
          name: message.guild.name,
          iconURL: message.guild.iconURL({ forceStatic: true, size: 4096 }),
        })
        .setDescription(
          map.length === 0
            ? "Belum ada yang donasi di bulan ini"
            : map.join("\n")
        )
        .setTimestamp();

      message.channel.send({ embeds: [embed] });
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = Trakteer;
