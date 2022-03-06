const Discord = require('discord.js');

const ms = require('ms');
const db = require('../../database').ga;

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
                        embed.addField('Hosted By:', m.author)
                        embed.setFooter(`${temporaly.winner} winners | Ended at`)
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

                        db.set(`${messageGiveaway.id}`, {
                            time: {
                                duration: temporaly.time,
                                now: Date.now()
                            },
                            message: {
                                authorID: message.author.id,
                                guildID: message.guild.id,
                                channelID: temporaly.channel,
                                id: messageGiveaway.id
                            },
                            winner: temporaly.winner,
                            entries: [],
                            embed
                        });
                        break;
                };
            });
            break;

        case 'reroll':
            if (!args[1]) return message.reply('Message ID required');
            const giveawayData = db.get(args[1]);
            if (!giveawayData) return message.reply('Not Found!');
            if (!giveawayData.isDone) return message.reply('Giveaway not ended!');

            const channel = client.channels.cache.get(giveawayData.message.channelID);
            const msg = await channel.messages.fetch(giveawayData.message.id);
            const entries = giveawayData.entries;
            const reroll = client.util.shuffle(entries);

            channel.send(`Congrats <@${reroll.shift()}>!\n${msg.url}`);
            break;

        case 'list':
            const giveawayDataList = db.all();
            if (!giveawayDataList.length) return message.reply('Nothing data!');

            const mapData = giveawayDataList.map(a => {
                const data = db.get(a.ID);

                return `[${data.message.id}](https://discord.com/channels/${data.message.guildID}/${data.message.channelID}/${data.message.id}) - ${data.embed.description} | ${data.isDone ? 'Telah Selesai' : 'Belum Selesai'}`;
            }).join('\n');

            const embede = new Discord.MessageEmbed().setColor(client.warna.kato).setTitle('Giveaways List');
            embede.setDescription(mapData);
            message.channel.send(embede);
            break;

        default:
            message.reply('Opsi tidak dimengerti oleh Kato!');
            break;
    }

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
