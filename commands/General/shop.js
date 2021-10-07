const Discord = require('discord.js');
const { MessageButton } = require('discord-buttons');
const db = require('../../database/schema/shop');
const dbUser = require('../../database/schema/event');

exports.run = async (client, message, args) => {
    const getProducts = await db.find({});
    const getUser = await dbUser.findOne({ userID: message.author.id });
    if (!getUser) return message.reply('Kamu bukan Partisipan.');

    const embedShop = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Kato Shop')
        .setDescription('Selamat Datang di Kato Shop!')
        .setFooter('Gunakan tombol untuk membeli!')

    if (getProducts.length === 0 || !getProducts) {
        embedShop.setDescription('Tidak ada item di Shop!')
    } else {
        i = 0;
        getProducts.sort((a, b) => b.price - a.price);
        for (product of getProducts) embedShop.addField(`${++i}. ${product.name}`, `${product.price} Tickets | ${product.stock} items available`);
    }
    const shopButton = new MessageButton().setStyle('green').setLabel('Beli 🛒').setID('shop');
    const shopEmbed = await message.channel.send({ embed: embedShop, button: shopButton });

    const collector = shopEmbed.createButtonCollector(button => button.clicker.user.id === message.author.id, { time: 600000 });
    collector.on('collect', async (button) => {
        button.reply.defer();
        switch (button.id) {
            case 'shop':
                message.reply('Pilih menggunakan angka, saat memasukkan nomor item akan langsung terbeli. hati-hati saat memasukkan nomor agar tidak salah beli!');
                const msgCollector = await message.channel.createMessageCollector(m => m.author.id === message.author.id, { time: 60000 });
                msgCollector.on('collect', async (msg) => {
                    if (msg.content === 'cancel') {
                        msg.reply.defer();
                        message.reply('Dibatalkan');
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
                                    return message.reply('Kamu telah memiliki Item ini, tidak dapat dibeli 2x');
                                }

                                getUser.tickets = getUser.ticket -= product.price;
                                product.stock = product.stock - 1;

                                message.reply(`Kamu membeli ${product.name} dengan ${product.price} tickets`);
                                getUser.items.push({
                                    name: product.name,
                                    used: false,
                                    isPending: false
                                });
                                client.channels.cache.get('336877836680036352').send(`**${message.author.tag}** membeli ${product.name} dengan ${product.price} tickets`);
                                msgCollector.stop();

                                await dbUser.findOneAndUpdate({ userID: message.author.id }, getUser);
                                await db.findOneAndUpdate({ name: product.name }, product);
                            } else {
                                message.reply('Tiket kamu tidak mencukupi.');
                                msgCollector.stop();
                            }
                        } else {
                            message.reply('Stok sedang tidak tersedia.');
                            msgCollector.stop();
                        }
                    } else {
                        message.reply('Kamu tidak memilih produk apapun.');
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