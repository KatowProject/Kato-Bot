const { Shop, User } = require('../../database/schema/TempEvent.js');
const Discord = require('discord.js');

class TempShop {
    constructor(obj) {
        this.isOpen = obj.isOpen;
        this.client = obj.client;
    }

    async ShopList(message) {
        try {
            if (!this.isOpen) return message.channel.send({ content: 'Shop is closed.' });

            const getProducts = await Shop.find({}).sort({ price: 1 });
            if (getProducts.length < 1) return message.reply({ content: 'Product not found' });

            const embed = new Discord.MessageEmbed()
                .setColor('GOLD')
                .setTitle('Shop List')
                .setDescription('Berikut harga menu yang tersedia. Kode mana yang ingin kamu pilih?\n\n')
                // must put footer
                .setFooter({ text: 'Copyright Perkumpulan Orang Santai © 2022', iconURL: message.guild.iconURL() });

            getProducts.forEach((product, i) => {
                embed.addFields(
                    {
                        name: `${i + 1}. ${product.name}`,
                        value: `${product.price} Tickets | ${product.stock} item available`
                    }
                )
            });

            const buttons = new Discord.MessageActionRow()
                .addComponents([
                    new Discord.MessageButton().setLabel("🛒").setStyle("PRIMARY").setCustomId(`buy-${message.id}`),
                ]);

            const msg = await message.channel.send({ embeds: [embed], components: [buttons] });
            const filter = (m) => m.user.id === message.author.id;
            const collector = msg.createMessageComponentCollector({ filter, time: 60000, max: 1 });
            collector.on("collect", async (i) => {
                if (i.customId === `buy-${message.id}`) {
                    await i.deferUpdate();
                    await this.buy(message, getProducts);
                }
            });


        } catch (err) {
            return message.channel.send({ content: 'Error: ' + err.message ?? err ?? 'Unknown error' });
        }
    }

    async buy(message, args) {
        try {
            const msg = await message.channel.send({ content: 'Masukkan nomor produk yang ingin kamu beli.' });
            const filter = (m) => m.author.id === message.author.id;
            const collector = msg.channel.createMessageCollector({ filter, time: 60000 });

            collector.on('collect', async (m) => {
                const productIndex = parseInt(m.content);
                if (isNaN(productIndex)) return message.channel.send({ content: 'Kamu harus memasukkan nomor produk.' });

                const product = args[productIndex - 1];
                if (!product) return message.channel.send({ content: 'Produk tidak ditemukan.' });

                const user = await User.findOne({ userID: message.author.id });
                if (!user) return message.channel.send({ content: 'Kamu belum terdaftar.' });

                if (user.ticket < product.price) return message.channel.send({ content: 'Kamu tidak memiliki cukup tiket untuk membeli produk ini.' });
                if (product.stock < 1) return message.channel.send({ content: 'Stock produk ini telah habis.' });

                await User.findOneAndUpdate({ userID: message.author.id }, { ticket: user.ticket - product.price });
                await Shop.findOneAndUpdate({ name: product.name }, { stock: product.stock - 1 });

                message.channel.send({ content: `Kamu telah membeli ${product.name} dengan harga ${product.price} tiket.` });
                collector.stop();
            });
        } catch (err) {
            return message.channel.send({ content: 'Error: ' + err.message ?? err ?? 'Unknown error' });
        }
    }

    async ShopManager(message, args) {
        if (!message.member.permissions.has("MANAGE_GUILD")) return message.reply(`Kamu tidak memiliki izin untuk menggunakan perintah ini!`);
        const products = await Shop.find({}).sort({ price: 1 });

        const embed = new Discord.MessageEmbed()
            .setColor('GOLD')
            .setTitle('Shop List')
            .setDescription('Berikut Produk yang tersedia')

        if (products.length < 1)
            embed.setDescription('Belum ada produk yang tersedia');
        else
            products.forEach((product, index) => {
                const { id, name, price, stock } = product;
                embed.addFields(
                    {
                        name: `${index + 1}. ${name}`,
                        value: `${price} Tickets | ${stock} item available`
                    }
                )
            });

        const buttons = products.length > 0
            ? new Discord.MessageActionRow()
                .addComponents([
                    new Discord.MessageButton().setLabel("Add").setStyle("PRIMARY").setCustomId(`add-${message.id}`),
                    new Discord.MessageButton().setLabel("Remove").setStyle("DANGER").setCustomId(`remove-${message.id}`),
                    new Discord.MessageButton().setLabel("Edit").setStyle("SECONDARY").setCustomId(`edit-${message.id}`),
                ]) : new Discord.MessageActionRow()
                    .addComponents([
                        // disabled
                        new Discord.MessageButton().setLabel("Add").setStyle("PRIMARY").setCustomId(`add-${message.id}`),
                        new Discord.MessageButton().setLabel("Remove").setStyle("DANGER").setCustomId(`remove-${message.id}`).setDisabled(true),
                        new Discord.MessageButton().setLabel("Edit").setStyle("SECONDARY").setCustomId(`edit-${message.id}`).setDisabled(true)
                    ]);

        const msg = await message.channel.send({ embeds: [embed], components: [buttons] });
        const filter = (m) => m.user.id === message.author.id;

        const collector = msg.createMessageComponentCollector({ filter, time: 60000, max: 1 });
        collector.on("collect", async (i) => {
            if (i.customId === `add-${message.id}`) {
                await i.deferUpdate();
                await this.addProduct(message, products);
            } else if (i.customId === `remove-${message.id}`) {
                await i.deferUpdate();
                await this.removeProduct(message, products);
            } else if (i.customId === `edit-${message.id}`) {
                await i.deferUpdate();
                await this.editProduct(message, products);
            }
        });
    }
    async addProduct(message, products) {
        try {
            const msg = await message.channel.send({ content: 'Masukkan nama, harga, dan stok produk yang ingin kamu tambahkan.' });
            const filter = (m) => m.author.id === message.author.id;
            const collector = msg.channel.createMessageCollector({ filter, time: 60000 });

            collector.on('collect', async (m) => {
                // split ", ", " , " and space
                const args = m.content.split(/, /);
                if (args.length < 3) return message.channel.send({ content: 'Format yang kamu masukkan tidak valid.' });
                const name = args[0];
                const price = parseInt(args[1]);
                const stock = parseInt(args[2]);

                if (!name || !price || !stock) return message.channel.send({ content: 'Kamu harus memasukkan nama, harga, dan stok produk yang ingin kamu tambahkan.' });

                const product = new Shop({
                    name,
                    price,
                    stock
                });

                await product.save();

                m.channel.send({ content: 'Produk berhasil ditambahkan.' });
                collector.stop();
            });
        } catch (err) {
            return message.channel.send({ content: 'Error: ' + err.message ?? err ?? 'Unknown error' });
        }
    }

    async removeProduct(message, products) {
        try {
            const msg = await message.channel.send({ content: 'Masukkan nomor produk yang ingin kamu hapus.' });
            const filter = (m) => m.author.id === message.author.id;
            const collector = msg.channel.createMessageCollector({ filter, time: 60000 });

            collector.on('collect', async (m) => {
                const index = parseInt(m.content) - 1;
                if (index < 0 || index > products.length) return message.channel.send({ content: 'Nomor produk yang kamu masukkan tidak valid.' });

                await Shop.deleteOne({ id: products[index].id });

                m.channel.send({ content: 'Produk berhasil dihapus.' });
                collector.stop();
            });
        } catch (err) {
            return message.channel.send({ content: 'Error: ' + err.message ?? err ?? 'Unknown error' });
        }
    }

    async editProduct(message, products) {
        try {
            const msg = await message.channel.send({ content: 'Masukkan id' });
            const filter = (m) => m.author.id === message.author.id;
            const collector = await msg.channel.createMessageCollector({ filter, time: 60000, max: 1 });
            collector.on('collect', async (m) => {
                const id = parseInt(m.content);
                if (id < 0 || id > products.length) return message.channel.send({ content: 'Nomor produk yang kamu masukkan tidak valid.' });
                const product = products[id - 1];
                if (!product) return message.channel.send({ content: 'Nomor produk yang kamu masukkan tidak valid.' });

                this.__editProduct(message, product);
                collector.stop();
            });

        } catch (err) {
            return message.channel.send({ content: 'Error: ' + err.message ?? err ?? 'Unknown error' });
        }
    }

    async __editProduct(message, product) {
        try {
            const msg = await message.channel.send({ content: 'Masukkan nama, harga, dan stok produk yang ingin kamu edit.' });
            const filter = (m) => m.author.id === message.author.id;
            const collector = msg.channel.createMessageCollector({ filter, time: 60000 });

            collector.on('collect', async (m) => {
                // split ", ", " , " and space
                const args = m.content.split(",")
                console.log(args);

                const name = args[0].trim();
                const price = parseInt(args[1].trim());
                const stock = parseInt(args[2].trim());

                console.log(name, price, stock);

                if (!name || !price || !stock) return message.channel.send({ content: 'Kamu harus memasukkan nama, harga, dan stok produk yang ingin kamu edit.' });

                await Shop.updateOne({ id: product.id }, {
                    name,
                    price,
                    stock
                });

                m.channel.send({ content: 'Produk berhasil diubah.' });
                collector.stop();
            });
        } catch (err) {
            return message.channel.send({ content: 'Error: ' + err.message ?? err ?? 'Unknown error' });
        }
    }
}

module.exports = TempShop;