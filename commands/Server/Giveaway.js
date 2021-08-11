const Discord = require('discord.js');
const { MessageButton } = require('discord-buttons');
const ms = require('ms');
const db = require('../../database/schema/Giveaway');

exports.run = async (client, message, args) => {

    const option = args[0];
    const embed = new Discord.MessageEmbed()

    switch (option) {
        case 'create':
            const temporaly = {};
            let cases = 'channel';

            const alertChannel = await message.reply('Pilih channel yang ingin dibuat Giveaway!');
            let alertTime = null;
            let alertWinner = null;
            let alertTitle = null;
            let alertFinal = null;

            const channelRequest = await message.channel.createMessageCollector(msg => msg.author.id === message.author.id, { time: 150000 });
            channelRequest.on('collect', async (m) => {
                switch (cases) {
                    case 'channel':
                        if (m.mentions.channels.size === 0) return message.reply('Invalid Channel!').then(t => t.delete({ timeout: 5000 }));
                        alertChannel.delete();
                        temporaly.channel = m.mentions.channels.first().id;

                        cases = 'time';
                        alertTime = await message.reply('Masukkan durasi Giveaway!');
                        break;

                    case 'time':
                        if (!ms(m.content)) return message.reply('Invalid Time!').then(t => t.delete({ timeout: 5000 }));
                        alertTime.delete();
                        temporaly.time = ms(m.content);

                        cases = 'winner';
                        alertWinner = await message.reply('Masukkan jumlah pemenang!');
                        break;

                    case 'winner':
                        if (!parseInt(m.content)) return message.reply('Invalid Winner!').then(t => t.delete({ timeout: 5000 }));
                        alertWinner.delete();
                        temporaly.winner = m.content;

                        cases = 'title';
                        alertTitle = await message.reply('Masukkan Judul Giveaway!');
                        break;

                    case 'title':
                        if (m.content.length < 10) return message.reply('Setidaknya isi Judul sebanyak 10 karakter!').then(t => t.delete({ timeout: 5000 }));
                        alertTitle.delete();
                        temporaly.title = m.content;

                        cases = 'final';

                        embed.setColor('RANDOM')
                        embed.setDescription(`**${temporaly.title}**`)
                        embed.addField('Dibuat oleh:', m.author)
                        embed.setFooter(`${temporaly.winner} pemenang | Berakhir pada`)
                        embed.setTimestamp(Date.now() + temporaly.time)
                        alertFinal = await message.reply('Apakah kamu sudah yakin?', { embed });
                        break;

                    case 'final':
                        if (m.content === 'cancel') {
                            alertFinal.delete();
                            message.reply('Dibatalkan!');
                            channelRequest.stop();
                        };

                        if (m.content !== 'ya') return message.reply('ketik **ya** jika sudah yakin, ketik **cancel** untuk membatalkan!');
                        alertFinal.delete();

                        const buttonsEntries = new MessageButton().setID('giveawayID').setLabel('🎉').setStyle('green');
                        embed.addField('Entries:', '0');
                        const messageGiveaway = await message.guild.channels.cache.get(temporaly.channel).send('🎉- Giveaway -🎉', { embed, button: buttonsEntries });

                        message.reply('Telah berhasil dikirim!');
                        channelRequest.stop();

                        await db.create({
                            messageID: messageGiveaway.id,
                            guildID: message.guild.id,
                            channelID: temporaly.channel,
                            time: {
                                start: Date.now(),
                                duration: temporaly.time
                            },
                            winnerCount: parseInt(temporaly.winner),
                            entries: [],
                            isDone: false,
                            embed
                        });
                        break;
                };
            });
            break;

        case 'reroll':
            if (!args[1]) return message.reply('Message ID required');
            const giveawayData = await db.findOne({ messageID: args[1] });
            if (!giveawayData) return message.reply('Not Found!');
            if (!giveawayData.isDone) return message.reply('Giveaway not ended!');

            const channel = client.channels.cache.get(giveawayData.channelID);
            const msg = await channel.messages.fetch(giveawayData.messageID);
            const entries = giveawayData.entries;
            const reroll = client.util.shuffle(entries);

            channel.send(`Selamat untuk <@${reroll.shift()}>!\n${msg.url}`);
            break;

        case 'list':
            const giveawayDataList = await db.find({});
            if (!giveawayDataList.length) return message.reply('Nothing data!');

            const mapData = giveawayDataList.map(a => `[${a.messageID}](https://discord.com/channels/${a.guildID}/${a.channelID}/${a.messageID}) - ${a.embed.description} | ${a.isDone ? 'Telah Selesai' : 'Belum Selesai'}`).join('\n');

            const embede = new Discord.MessageEmbed().setColor(client.warna.kato).setTitle('Giveaways List');
            embede.setDescription(mapData);
            message.channel.send(embede);
            break;

        case 'end':
            if (!args[1]) return message.reply('Message ID required');
            const giveawayDataEnd = await db.findOne({ messageID: args[1] });
            if (!giveawayDataEnd) return message.reply('Not Found!');
            if (giveawayDataEnd.isDone) return message.reply('Giveaway already ended!');

            giveawayDataEnd.time.duration = 0;
            await db.findOneAndUpdate({ messageID: giveawayDataEnd.messageID }, giveawayDataEnd);

            message.reply('Telah selesai diberhentikan, tunggu 1-10 detik ya!').then(t => t.delete({ timeout: 5000 }));
            break;
        default:
            message.reply('Opsi tidak dimengerti oleh Kato!');
            break;
    };

};

exports.conf = {
    aliases: ['ga'],
    cooldown: 10,
    permissions: ['MANAGE_MESSAGES']
};

exports.help = {
    name: 'giveaway',
    description: 'buat giveaway',
    usage: 'giveaway',
    example: 'giveaway'
}