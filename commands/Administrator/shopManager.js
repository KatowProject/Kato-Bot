const Discord = require('discord.js');
const { MessageButton } = require('discord-buttons');
const db = require('../../database/schema/shop');

exports.run = async (client, message, args) => {
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("You don't have permission to use this command!");
    const getProducts = await db.find({});

    const embedShop = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Shop Manager')
        .setDescription('Here you can manage your shop!');

    if (getProducts.length === 0) {
        embedShop.setDescription('There are no products in the shop!');
    } else {
        for (const product of getProducts) embedShop.addField(`${product.name}`, `${product.price} Tickets | ${product.stock} item available`);
    }

    const backwardsButton = new MessageButton().setStyle('grey').setLabel('Add').setID('addID');
    const deleteButton = new MessageButton().setStyle('grey').setLabel('Edit').setID('editID');
    const forwardsButton = new MessageButton().setStyle('red').setLabel('Remove').setID('removeID');

    const r = await message.channel.send({ embed: embedShop, buttons: [backwardsButton, deleteButton, forwardsButton] });
    const collector = r.createButtonCollector(button => button.clicker.user.id === message.author.id, { time: 600000 });

    collector.on('collect', async (button) => {
        button.reply.defer();
        switch (button.id) {
            case 'addID':
                message.reply('What do you want to add?');
                await addProduct(button);
                break;
            case 'editID':
                message.reply('What do you want to edit?');
                await editProduct(button);
                break;
            case 'removeID':
                message.reply('What do you want to remove?');
                await removeProduct(button);
                break;
            default:
                message.reply('You have to choose a button!');
                break;
        }
    });

    async function addProduct() {
        const collector = await message.channel.createMessageCollector(m => m.author.id === message.author.id, { time: 600000 });
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
        const collector = await message.channel.createMessageCollector(m => m.author.id === message.author.id, { time: 600000 });
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
        const collector = await message.channel.createMessageCollector(m => m.author.id === message.author.id, { time: 600000 });
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
}

exports.conf = {
    cooldown: 5,
    aliases: [],
}

exports.help = {
    name: 'shopm',
    description: 'Manage your shop!',
    usage: 'shop'
}