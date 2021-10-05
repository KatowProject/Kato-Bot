const Discord = require('discord.js');
const { MessageButton } = require('discord-buttons');
const db = require('../../database/schema/shop');
const dbUser = require('../../database/schema/event');

exports.run = async (client, message, args) => {
    const getProducts = await db.find({});
    const getUser = await dbUser.findOne({ userID: message.author.id });
    if (!getUser) return message.reply('You are not participant');

    const embedShop = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Shop')
        .setDescription('Welcome to the shop!')
        .setFooter('Use the button to buy items!')

    if (getProducts.length === 0 || !getProducts) {
        embedShop.setDescription('No items in the shop!')
    } else {
        for (product of getProducts) embedShop.addField(product.name, `${product.price} Tickets | ${product.stock} items available`);
    }
    const shopButton = new MessageButton().setStyle('green').setLabel('Shop 🛒').setID('shop');
    const shopEmbed = await message.channel.send({ embed: embedShop, button: shopButton });

    const collector = shopEmbed.createButtonCollector(button => button.clicker.user.id === message.author.id, { time: 600000 });
    collector.on('collect', async (button) => {
        button.reply.defer();
        switch (button.id) {
            case 'shop':
                message.reply('Choose with number to buy product');
                const msgCollector = await message.channel.createMessageCollector(m => m.author.id === message.author.id, { time: 60000 });
                msgCollector.on('collect', async (msg) => {
                    if (msg.content === 'cancel') {
                        msg.reply.defer();
                        message.reply('Canceled');
                        msgCollector.stop();
                        return;
                    }
                    const product = getProducts[msg.content - 1];
                    if (product) {
                        if (product.stock > 0) {
                            if (product.price <= getUser.ticket) {
                                const isHave = getUser.items.find(item => item.name === product.name);
                                if (isHave) {
                                    msgCollector.stop();
                                    return message.reply('You already have this item');
                                }

                                getUser.tickets = getUser.ticket -= product.price;
                                product.stock = product.stock - 1;

                                message.reply(`You bought ${product.name} for ${product.price} tickets`);
                                getUser.items.push({
                                    name: product.name,
                                    used: false,
                                    isPending: false
                                });
                                client.channels.cache.get('336877836680036352').send(`**${message.author.tag}** bought ${product.name} for ${product.price} tickets`);
                                msgCollector.stop();

                                await dbUser.findOneAndUpdate({ userID: message.author.id }, getUser);
                                await db.findOneAndUpdate({ name: product.name }, product);
                            } else {
                                message.reply('You dont have enough tickets');
                                msgCollector.stop();
                            }
                        } else {
                            message.reply('This product is out of stock');
                            msgCollector.stop();
                        }
                    } else {
                        message.reply('You didnt choose a product');
                    }
                });
                break;
        }
    });
};

exports.conf = {
    cooldown: 5,
    aliases: [],
};

exports.help = {
    name: 'shop',
    description: 'Shows the shop',
    usage: 'shop',
    example: 'shop'
};