const { Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, quote } = require("discord.js");
const Client = require("../../core/ClientBuilder");

/**
 * @param {Client} client
 * @param {Message} message
 * @param {Array} args
 */
exports.run = async (client, message) => {
    try {
        const products = await client.katoShop.user.getProducts();

        const embed = generateProductEmbed(products);
        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("buy")
                .setLabel("🛒")
                .setStyle(ButtonStyle.Primary),
        );

        const msg = await message.reply({
            embeds: [embed],
            components: [buttons],
        });

        const filter = (interaction) => interaction.isButton() && interaction.user.id === message.author.id;
        const collector = msg.createMessageComponentCollector({ filter, time: 60000 });

        collector.on("collect", async (interaction) => {
            if (!interaction.isButton()) return;
            if (!interaction.customId === "buy") return;

            await interaction.deferUpdate();

            chooseProduct();
        });

        const chooseProduct = async () => {
            const msg = await message.reply("Pilih produk yang ingin dibeli dengan mengetik nomor produk");

            const filter = (m) => m.author.id === message.author.id;
            const collector = msg.channel.createMessageCollector({ filter, time: 60000 });

            collector.on("collect", async (m) => {
                const product = products[parseInt(m.content) - 1];
                if (!product) return message.reply("Produk tidak ditemukan");

                try {
                    await client.katoShop.user.buyProduct(message.author, product);

                    message.reply(`Berhasil membeli produk **${product.name}**`);

                    await msg.edit({
                        embeds: [generateProductEmbed(products)],
                        components: [buttons],
                    });

                    message.guild.channels.cache.get(client.katoShop.option.channel).send({
                        content: `🎉 **${message.author.tag}** telah membeli produk **${product.name}**`,
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({
                                    name: message.author.tag,
                                    iconURL: message.author.displayAvatarURL(),
                                })
                                .setDescription(`**${product.name}** - ${product.price} Tickets`)
                                .setColor("Random")
                                .setTimestamp(),
                        ],
                    });
                } catch (e) {
                    message.reply(`Gagal membeli produk, \`${e}\``);
                }

                collector.stop();
            });
        }
    } catch (e) {
        message.reply(`Gagal membuka shop, \`${e}\``);
    }


    function generateProductEmbed(products) {
        const embed = new EmbedBuilder()
            .setTitle("List Produk")
            .setAuthor({
                name: "Kato Shop",
                iconURL: client.user.displayAvatarURL(),
            })
            .setDescription(products.length > 0
                ? products
                    .map((product, i) => {
                        const p = quote(
                            `🎟️ ${product.price} Tickets - \`Tersisa ${product.stock}\``
                        );
                        return `${i + 1}. **${product.name}** - ${product.isAvailable ? "🟢" : "🔴"
                            } \n${p}`;
                    })
                    .join("\n")
                : "Tidak ada produk yang tersedia"
            )
            .setColor("Random")
            .setTimestamp()
            .setFooter({
                text: "Pilih aksi menggunakan tombol dibawah",
            });

        return embed;
    }
};

exports.conf = {
    aliases: [],
    cooldown: 5,
    location: __filename,
};

exports.help = {
    name: "shop",
    description: "Product Kato Shop",
    usage: "shop",
    example: "shop",
};
