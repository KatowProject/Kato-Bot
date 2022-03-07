const Discord = require('discord.js');
const ms = require('ms');
const db = require('../database').ga;

module.exports = class Giveaway {
    constructor(client) {
        this.client = client;
    }

    create(message) {
        return new Promise(async (resolve, reject) => {
            try {
                const data = {};

                let status = null;
                let msg = await message.channel.send('Pilih channel yang ingin dijadikan tempatnya!');

                status = 'channel';
                let collector = await message.channel.createMessageCollector({ filter: (m) => m.author.id === message.author.id, time: 120000 });
                collector.on('collect', async m => {
                    switch (status) {
                        case 'channel':
                            if (m.mentions.channels.size === 0) return m.reply('Invalid Channel!')
                                .then(t => setTimeout(() => t.delete(), 5000));
                            msg.delete();
                            data.channel = m.mentions.channels.first().id;

                            status = 'time';
                            msg = await message.channel.send(`<#${m.mentions.channels.first().id}> menjadi tempat Giveaway, selanjutnya silahkan masukkan durasi Giveaway!`);
                            break;

                        case 'time':
                            const timelist = m.content.split(' ');
                            const totalTime = [];
                            for (const time of timelist) {
                                if (!ms(time)) return m.reply('Invalid Time!').then(t => setTimeout(() => t.delete(), 5000));
                                totalTime.push(ms(time));
                            }

                            msg.delete();
                            data.time = totalTime.reduce((a, c) => a + c);

                            status = 'winner';
                            msg = await message.channel.send(`Giveaway berdurasi **${this.client.util.parseDur(data.time)}**, selanjutnya masukkan jumlah pemenang!`);
                            break;

                        case 'winner':
                            if (!parseInt(m.content)) return message.reply('Invalid Winner!').then(t => setTimeout(() => t.delete(), 5000));

                            msg.delete();
                            data.winner = m.content;

                            collector.stop();
                            await this._createOption(message, data);
                            break;
                    }

                    resolve();
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    _createOption(message, data) {
        return new Promise(async (resolve, reject) => {
            try {
                const select = new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageSelectMenu()
                            .setCustomId(`select-${message.id}`)
                            .addOptions([
                                {
                                    label: 'Role',
                                    description: 'Menggunakan Role',
                                    value: 'ROLE'
                                },
                                {
                                    label: 'None',
                                    description: 'Tidak menggunakan syarat apapun',
                                    value: 'NONE'
                                }
                            ])
                    );

                const r = await message.channel.send({ content: 'Pilih opsi yang ingin dipilih!', components: [select] });
                const collector = await r.channel.createMessageComponentCollector({ filter: m => m.user.id === message.author.id && m.componentType === 'SELECT_MENU', time: 60_000 });
                collector.on('collect', async m => {
                    await m.deferUpdate();
                    data.values = m.values.shift();
                    collector.stop();
                    r.delete();

                    let msg = data.values === 'MEE6' ? await message.reply('Masukkan level yang dibutuhkan!')
                        : data.values === 'ROLE' ? await message.reply('Silahkan masukkan role yang ingin dimasukkan (Name, RoleID)\n**Contoh**: santai dermawan, nitro boost, santai')
                            : await message.reply('Masukkan judulnya!');

                    if (data.values === 'NONE') {
                        data.values = 'title';
                        data.require = { name: 'NONE' };
                    }

                    const collector2 = await message.channel.createMessageCollector({ filter: c => c.author.id === message.author.id, time: 69_000 });
                    collector2.on('collect', async m => {
                        switch (data.values) {
                            case 'MEE6':
                                if (!parseInt(m.content)) return message.reply('Harus bernilai angka!');

                                data.require = { name: 'MEE6', value: m.content };
                                data.values = 'title';

                                msg = await message.reply('Masukkan judulnya!');
                                break;

                            case 'ROLE':
                                const query = m.content;
                                const roles = query.split(',');
                                data.require = { name: 'ROLE', value: [] };

                                const roleTemp = data.require.value;
                                for (const role of roles) {
                                    if (role.length < 1) continue;
                                    const name = role.trim();

                                    const roleID = message.guild.roles.cache.get(name);
                                    const findRole = message.guild.roles.cache.find(a => a.name.toLowerCase() === name.toLowerCase());
                                    const roleRegex = new RegExp(name, "i");
                                    const findRegex = message.guild.roles.cache.find(a => roleRegex.test(a.name) ? roleRegex.test(a.name) : null);

                                    if (roleID) {
                                        roleTemp.push(roleID.id);
                                    } else if (findRole) {
                                        roleTemp.push(findRole.id);
                                    } else if (findRegex) {
                                        roleTemp.push(findRegex.id);
                                    } else {
                                        message.reply(`Role ${name} tidak ditemukan`);
                                        return;
                                    };
                                };

                                data.values = 'title';
                                msg = await message.reply('Masukkan judulnya!');
                                break;

                            case 'title':
                                if (m.content.length < 10) return message.reply('Setidaknya isi Judul sebanyak 10 karakter!').then(t => setTimeout(() => t.delete(), 5000));
                                msg.delete();
                                collector2.stop();

                                if (data.values === 'NONE') data.require = { name: 'NONE' };
                                data.title = m.content;
                                await this._createFinal(message, data);
                                break;
                        }
                    });
                });

                resolve();
            } catch (e) {
                reject(e);
            }
        });
    };

    _createFinal(message, data) {
        return new Promise(async (resolve, reject) => {
            const embed = new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setDescription(`**${data.title}**`)
                .addField('Dibuat oleh:', `<@${message.author.id}>`)
                .setFooter(`${data.winner} pemenang | Berakhir pada`)
                .setTimestamp(Date.now() + data.time)

            data.require.name === 'MEE6' ? embed.addField('Dibutuhkan:', `Level MEE6 - **${data.require.value}**`)
                : data.require.name === 'ROLE' ? embed.addField('Dibutuhkan:', `Role ${data.require.value.map(a => `<@&${a}>`).join(', ')}`)
                    : embed.addField('Dibutuhkan:', '**Tidak ada**');

            const buttons = new Discord.MessageActionRow()
                .addComponents([
                    new Discord.MessageButton()
                        .setLabel('✔️')
                        .setStyle('SUCCESS')
                        .setCustomId(`y-${message.id}`)
                    ,
                    new Discord.MessageButton()
                        .setLabel('❌')
                        .setStyle('DANGER')
                        .setCustomId(`n-${message.id}`)
                ]);
            const r = await message.channel.send({ content: 'Apakah kamu sudah yakin?', embeds: [embed], components: [buttons] });
            const collector = r.channel.createMessageComponentCollector({ filter: msg => msg.user.id === message.author.id, time: 60_000 });
            collector.on('collect', async m => {
                await m.deferUpdate();
                switch (m.customId) {
                    case `y-${message.id}`:
                        embed.addField('Entries:', '0');
                        const giveaway = await message.guild.channels.cache.get(data.channel).send({
                            content: '🎉- Giveaway -🎉', embeds: [embed], components: [
                                new Discord.MessageActionRow()
                                    .addComponents(
                                        new Discord.MessageButton()
                                            .setLabel('🎉')
                                            .setStyle('SUCCESS')
                                            .setCustomId('giveawayID')
                                    )
                            ]
                        });

                        await db.set(`${giveaway.id}`, {
                            messageID: giveaway.id,
                            guildID: message.guild.id,
                            channelID: data.channel,
                            time: {
                                start: Date.now(),
                                duration: data.time
                            },
                            require: data.require,
                            winnerCount: parseInt(data.winner),
                            entries: [],
                            isDone: false,
                            embed
                        });

                        message.channel.send('Telah berhasil dikirim!');
                        break;

                    case `n-${message.id}`:
                        message.channel.send('Dibatalkan!');
                        break;
                }
                collector.stop();
            })

            resolve();
        });
    }

    reroll(message, args) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!args[1]) return message.reply('Message ID required');
                const giveawayData = db.get(args[1]);
                if (!giveawayData) return message.reply('Not Found!');
                if (!giveawayData.isDone) return message.reply('Giveaway not ended!');

                const channel = this.client.channels.cache.get(giveawayData.channelID);
                const msg = await channel.messages.fetch(giveawayData.messageID);
                const entries = giveawayData.entries;
                const reroll = this.client.util.shuffle(entries);

                channel.send(`Selamat untuk <@${reroll.shift()}>!\n${msg.url}`);
                message.reply('Berhasil direroll!');

                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }

    getData(message, args) {
        return new Promise(async (resolve, reject) => {
            try {
                const giveawayDataList = db.all().map(a => a.data);
                if (!giveawayDataList.length) return message.reply('Nothing data!');

                const mapData = giveawayDataList.map(a => `[${a.messageID}](https://discord.com/channels/${a.guildID}/${a.channelID}/${a.messageID}) - ${a.embed.description} | ${a.isDone ? 'Telah Selesai' : 'Belum Selesai'}`);
                const chunkData = this.client.util.chunk(mapData, 10);

                let pagination = 1;
                const embede = new Discord.MessageEmbed().setColor('RANDOM').setTitle('Giveaways List');

                embede.setDescription(chunkData[pagination - 1].join('\n'));
                embede.setFooter(`Page ${pagination} of ${chunkData.length}`);

                const button = new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageButton()
                            .setLabel('< Back')
                            .setStyle('SECONDARY')
                            .setCustomId(args[0] + 'back' + message.id),
                        new Discord.MessageButton()
                            .setLabel('Next >')
                            .setStyle('SECONDARY')
                            .setCustomId(args[0] + 'next' + message.id),
                        new Discord.MessageButton()
                            .setLabel('🗑️')
                            .setStyle('DANGER')
                            .setCustomId(args[0] + 'delete' + message.id)
                    )

                const m = await message.channel.send({ embeds: [embede], components: [button] });
                const collector = m.channel.createMessageComponentCollector({ filter: msg => msg.user.id === message.author.id, time: 60000 });
                collector.on('collect', async (i) => {
                    switch (i.customId) {
                        case args[0] + 'back' + message.id:
                            if (pagination === 0) return;
                            pagination--;
                            embede.setDescription(chunkData[pagination - 1].join('\n'));
                            embede.setFooter(`Page ${pagination} of ${chunkData.length}`);
                            m.edit({ embeds: [embede], components: [button] });
                            break;

                        case args[0] + 'next' + message.id:
                            if (pagination === chunkData.length) return;
                            pagination++;
                            embede.setDescription(chunkData[pagination - 1].join('\n'));
                            embede.setFooter(`Page ${pagination} of ${chunkData.length}`);
                            m.edit({ embeds: [embede], components: [button] });
                            break;

                        case args[0] + 'delete' + message.id:
                            m.delete();
                            break;
                    };

                    await i.deferUpdate();
                });

                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }

    end(message, args) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!args[1]) return message.reply('Message ID required');
                const giveawayDataEnd = await db.get(args[1]);
                if (!giveawayDataEnd) return message.reply('Not Found!');
                if (giveawayDataEnd.isDone) return message.reply('Giveaway already ended!');

                giveawayDataEnd.time.duration = 0;
                db.set(args[1], giveawayDataEnd);

                message.reply('Telah selesai diberhentikan, tunggu 1-10 detik ya!').then(t => setTimeout(() => t.delete(), 5000));

                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }

    delete(message, args) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!args[1]) return message.reply('Message ID required!');
                const giveawayDataDelete = db.get(args[1]);
                if (!giveawayDataDelete) return message.reply('Not Found!');
                if (!giveawayDataDelete.isDone) return message.reply(`Giveaway isn't over yet, pls end giveaway first!`).then(a => a.delete({ timeout: 5000 }));

                db.delete(args[1]);
                message.reply(`Telah selesai dihapus!`);

                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }
}