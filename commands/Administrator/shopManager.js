const Discord = require('discord.js');
const db = require('../../database/schema/Shop');

exports.run = async (client, message, args) => {
    try {
        if (!message.member.permissions.has("MANAGE_GUILD")) return message.reply(`Kamu tidak memiliki izin untuk menggunakan perintah ini!`);
        const products = await db.find({});

        const embedShop = new Discord.MessageEmbed().setColor("RANDOM").setTitle("Shop Manager").setDescription('Here is the list of products available in the shop!');

        if (products.length === 0) {
            embedShop.setDescription('There are no products in the shop!');
        } else {
            i = 0;
            products.sort((a, b) => b.price - a.price);
            for (const product of products) embedShop.addField(`${++i}. ${product.name}`, `${product.price} Tickets | ${product.stock} item available`);
        }

        const buttons = new Discord.MessageActionRow()
            .addComponents([
                new Discord.MessageButton().setLabel("Add").setStyle("PRIMARY").setCustomId(`add-${message.id}`),
                new Discord.MessageButton().setLabel("Remove").setStyle("DANGER").setCustomId(`remove-${message.id}`),
                new Discord.MessageButton().setLabel("Edit").setStyle("SECONDARY").setCustomId(`edit-${message.id}`),
            ]);

        const r = await message.channel.send({ embeds: [embedShop], components: [buttons] });
        const collector = r.channel.createMessageComponentCollector({ filter: msg => msg.user.id === message.author.id, time: 60_000 });
        collector.on("collect", async m => {
            await m.deferUpdate();
            switch (m.customId) {
                case `add-${message.id}`:
                    message.reply("Please enter the name of the product you want to add!");
                    await addProduct();
                    break;

                case `remove-${message.id}`:
                    message.reply("Please enter the name of the product you want to remove!");
                    await removeProduct();
                    break;

                case `edit-${message.id}`:
                    message.reply("Please enter the name of the product you want to edit!");
                    await editProduct();
                    break;
            }
            collector.stop();
        });

        async function addProduct() {
            const collector = await message.channel.createMessageCollector({ filter: m => m.author.id === message.author.id, time: 60_000 });
            collector.on('collect', async (m) => {
                if (m.content.toLowerCase() === 'cancel') {
                    message.reply('You have canceled the add process!');
                    collector.stop();
                } else {
                    const product = m.content.split(',');
                    if (product.length !== 3) return message.reply('You have to enter the product name, price and stock!');

                    const name = product[0];
                    const price = product[1];
                    const stock = product[2];

                    const productExists = await db.findOne({ name: name });
                    if (productExists) return message.reply('This product already exists!');
                    if (isNaN(price) || isNaN(stock)) return message.reply('You have to enter a number!');
                    if (price <= 0 || stock <= 0) return message.reply('You have to enter a number greater than 0!');

                    await db.create({ name: name, price: price, stock: stock });
                    message.reply('You have added the product!');
                    collector.stop();
                }
            });
        }

        async function editProduct() {
            const collector = await message.channel.createMessageCollector({ filter: m => m.author.id === message.author.id, time: 60_000 });
            collector.on('collect', async (m) => {
                if (m.content.toLowerCase() === 'cancel') {
                    message.reply('You have canceled the edit process!');
                    collector.stop();
                } else {
                    const product = m.content.split(',');
                    if (product.length !== 3) return message.reply('You have to enter the product name, price and stock!');

                    const name = product[0];
                    const price = product[1];
                    const stock = product[2];

                    const productExists = await db.findOne({ name: name });
                    if (!productExists) return message.reply('This product does not exist!');
                    if (isNaN(price) || isNaN(stock)) return message.reply('You have to enter a number!');
                    if (price <= 0 || stock <= 0) return message.reply('You have to enter a number greater than 0!');

                    await db.findOneAndUpdate({ name: name }, { $set: { price: price, stock: stock } });
                    message.reply('This product has been updated');
                    collector.stop();
                }
            });
        }

        async function removeProduct() {
            const collector = await message.channel.createMessageCollector({ filter: m => m.author.id === message.author.id, time: 60_000 });
            collector.on('collect', async (m) => {
                if (m.content.toLowerCase() === 'cancel') {
                    message.reply('You have canceled the remove process!');
                    collector.stop();
                } else {
                    const product = m.content.split(',');
                    if (product.length !== 1) return message.reply('You have to enter the product name!');
                    const name = product[0];
                    const productExists = await db.findOne({ name: name });
                    if (!productExists) return message.reply('This product does not exist!');

                    await db.findOneAndDelete({ name: name });
                    message.reply('This product has been removed!');
                    collector.stop();
                }
            });
        }
    } catch (err) {
        message.channel.send(`Something went wrong: ${error.message}`);
    }
};

exports.conf = {
    aliases: [],
    cooldown: 5,
    location: __filename
}
exports.help = {
    name: 'mshop',
    description: 'Manajemen Kato Shop',
    usage: 'mshop',
    example: 'mshop'
}

