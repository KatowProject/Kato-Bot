const { Client, Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, ComponentType, ButtonInteraction } = require('discord.js');
const ms = require('ms');

module.exports = class Giveaway {
    /**
     * First, we need to create a constructor.
     * @param {Client} client 
     */
    constructor(client, time = 60_000) {
        if (!client) throw new Error('Client is not defined!');
        if (!time) throw new Error('Time is not defined!');

        this.client = client;
        this.interval = time;
        this.db = this.client.db.giveaway;
    }

    /**
     * 
     * @param {Message} message 
     * @returns Promise<GiveawayData>
     */
    create(message) {
        return new Promise(async (resolve, reject) => {
            try {
                const data = {};

                let status = null;
                let msg = await message.channel.send('Pilih channel yang ingin dijadikan tempatnya!');

                status = 'channel';
                let collector = message.channel.createMessageCollector({ filter: (m) => m.author.id === message.author.id, time: 120000 });
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

    /**
     * 
     * @param {Message} message 
     * @param {*} data 
     * @returns 
     */
    _createOption(message, data) {
        return new Promise(async (resolve, reject) => {
            try {
                const select = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
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
                            .setPlaceholder('Pilih opsi yang ingin dipilih!')
                    );

                const r = await message.channel.send({ content: 'Pilih opsi yang ingin dipilih!', components: [select] });
                const collector = r.channel.createMessageComponentCollector({ filter: m => m.user.id === message.author.id && m.componentType === ComponentType.StringSelect, time: 60_000 });
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

                    const collector2 = message.channel.createMessageCollector({ filter: c => c.author.id === message.author.id, time: 69_000 });
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

    /**
     * 
     * @param {Message} message 
     * @param {*} data
     * @returns 
     */
    _createFinal(message, data) {
        return new Promise(async (resolve, reject) => {
            const embed = new EmbedBuilder()
                .setColor('Random')
                .setDescription(`**${data.title}**`)
                .addFields(
                    { name: 'Dibuat oleh:', value: `<@${message.author.id}>` },
                )
                .setFooter({ text: `${data.winner} pemenang | Berakhir pada` })
                .setTimestamp(Date.now() + data.time)

            data.require.name === 'MEE6' ? embed.addFields({ name: 'Dibutuhkan:', value: `Level MEE6 - **${data.require.value}**` })
                : data.require.name === 'ROLE' ? embed.addFields({ name: 'Dibutuhkan:', value: `Role ${data.require.value.map(a => `<@&${a}>`).join(', ')}` })
                    : embed.addFields({ name: 'Dibutuhkan:', value: '**Tidak ada**' });

            const buttons = new ActionRowBuilder()
                .addComponents([
                    new ButtonBuilder()
                        .setLabel('✔️')
                        .setStyle(ButtonStyle.Success)
                        .setCustomId(`y-${message.id}`)
                    ,
                    new ButtonBuilder()
                        .setLabel('❌')
                        .setStyle(ButtonStyle.Danger)
                        .setCustomId(`n-${message.id}`)
                ]);
            const r = await message.channel.send({ content: 'Apakah kamu sudah yakin?', embeds: [embed], components: [buttons] });
            const collector = r.channel.createMessageComponentCollector({ filter: msg => msg.user.id === message.author.id, time: 60_000 });
            collector.on('collect', async m => {
                await m.deferUpdate();
                switch (m.customId) {
                    case `y-${message.id}`:
                        embed.addFields({ name: 'Entries:', value: '0' });
                        const giveaway = await message.guild.channels.cache.get(data.channel).send({
                            content: '🎉- Giveaway -🎉', embeds: [embed], components: [
                                new ActionRowBuilder()
                                    .addComponents(
                                        new ButtonBuilder()
                                            .setLabel('🎉')
                                            .setStyle(ButtonStyle.Success)
                                            .setCustomId('giveawayID')
                                    )
                                    .addComponents(
                                        new ButtonBuilder()
                                            .setLabel('❌')
                                            .setStyle(ButtonStyle.Danger)
                                            .setCustomId('giveawayCancel')
                                    )
                            ]
                        });

                        await this.db.set(`${giveaway.id}`, {
                            messageID: giveaway.id,
                            guildID: message.guild.id,
                            channelID: data.channel,
                            time: {
                                start: Date.now(),
                                duration: data.time,
                            },
                            require: data.require,
                            winnerCount: parseInt(data.winner),
                            entries: [],
                            isDone: false,
                            embed: embed.toJSON(),
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

    /**
     * 
     * @param {Message} message 
     * @param {[]} args 
     * @returns 
     */
    reroll(message, args) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!args[1]) return message.reply('Message ID required');
                const giveawayData = await this.db.get(args[1]);
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

    /**
     * 
     * @param {Message} message 
     * @param {[]} args 
     * @returns 
     */
    getData(message, args) {
        return new Promise(async (resolve, reject) => {
            try {
                const giveaways = await this.db.all();
                const giveawayDataList = giveaways.map(a => a.value);
                if (!giveawayDataList.length) return message.reply('Nothing data!');

                const mapData = giveawayDataList.map(a => `[${a.messageID}](https://discord.com/channels/${a.guildID}/${a.channelID}/${a.messageID}) - ${a.embed.description} | ${a.isDone ? 'Telah Selesai' : 'Belum Selesai'}`);
                const chunkData = this.client.util.chunk(mapData, 10);

                let pagination = 1;
                const embede = new EmbedBuilder().setColor('Random').setTitle('Giveaways List');

                embede.setDescription(chunkData[pagination - 1].join('\n'));
                embede.setFooter({ text: `Page ${pagination} of ${chunkData.length}` });

                const button = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel('< Back')
                            .setStyle(ButtonStyle.Secondary)
                            .setCustomId(args[0] + 'back' + message.id),
                        new ButtonBuilder()
                            .setLabel('Next >')
                            .setStyle(ButtonStyle.Secondary)
                            .setCustomId(args[0] + 'next' + message.id),
                        new ButtonBuilder()
                            .setLabel('🗑️')
                            .setStyle(ButtonStyle.Danger)
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
                            embede.setFooter({ text: `Page ${pagination} of ${chunkData.length}` });
                            m.edit({ embeds: [embede], components: [button] });
                            break;

                        case args[0] + 'next' + message.id:
                            if (pagination === chunkData.length) return;
                            pagination++;
                            embede.setDescription(chunkData[pagination - 1].join('\n'));
                            embede.setFooter({ text: `Page ${pagination} of ${chunkData.length}` });
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
                const giveawayDataEnd = await this.db.get(args[1]);
                if (!giveawayDataEnd) return message.reply('Not Found!');
                if (giveawayDataEnd.isDone) return message.reply('Giveaway already ended!');

                giveawayDataEnd.time.duration = 0;
                await this.db.set(args[1], giveawayDataEnd);

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
                const giveawayDataDelete = await this.db.get(args[1]);
                if (!giveawayDataDelete) return message.reply('Not Found!');
                if (!giveawayDataDelete.isDone) return message.reply(`Giveaway isn't over yet, pls end giveaway first!`).then(a => a.delete({ timeout: 5000 }));

                await this.db.delete(args[1]);
                message.reply(`Telah selesai dihapus!`);

                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * 
     */
    async __timeHandler() {
        const giveaways = await this.db.all();
        const allGiveaway = giveaways.map(a => a.value);
        for (const data of allGiveaway) {
            const channel = this.client.channels.cache.get(data.channelID);
            if (!channel) continue;
            const timeLeft = Date.now() - data.time.start;

            if (timeLeft > data.time.duration) {
                if (data.isDone) continue;

                const msg = await channel.messages.fetch(data.messageID);
                if (data.entries.length === 0) {
                    data.isDone = true;
                    data.embed.fields[3] = { name: 'Pemenang:', value: 'Tidak ada yang menang', inline: false };

                    msg.edit({ content: '**🎉- Giveaway Ended -🎉**', embeds: [data.embed] });
                    await this.db.set(data.messageID, data);

                    return this.client.channels.cache.get(data.channelID).send(`Tidak ada yang menang karna nol partisipan!`);
                };

                const winLength = data.winnerCount;
                const win = this.client.util.shuffle(data.entries);
                const winners = win.slice(0, winLength);

                data.isDone = true;
                data.embed.fields[3] = { name: 'Winners:', value: winners.map(a => `<@${a}>`).join(', '), inline: false };

                msg.edit({ content: '**🎉- Giveaway Ended -🎉**', embeds: [data.embed] });
                this.client.channels.cache.get(data.channelID).send({ content: `Congrats ${winners.map(a => `<@${a}>`).join(', ')}!\n${msg.url}`, allowedMentions: { parse: ["users"] } });

                await this.db.set(data.messageID, data);
            }
        }
    }

    /**
     * 
     * @param {ButtonInteraction} interaction 
     * @returns Promise<void>
     */
    giveawayValidator(interaction) {
        return new Promise(async (resolve, reject) => {
            if (interaction.customId != 'giveawayID') return;
            await interaction.deferUpdate();
            const data = await this.db.get(interaction.message.id);

            if (!data) return interaction.followUp({ content: 'Giveaway tidak ditemukan!', ephemeral: true });
            if (data.isDone) return interaction.followUp({ content: 'Giveaway sudah berakhir!', ephemeral: true });
            if (data.entries.includes(interaction.user.id)) return interaction.followUp({ content: 'Kamu telah mengikuti giveaway ini!', ephemeral: true });

            let isOK = null;
            switch (data.require.name) {
                case 'ROLE':
                    const requireRole = data.require.value;
                    const rolePlayer = interaction.member.roles.cache;
                    for (const role of requireRole) if (rolePlayer.has(role)) isOK = true;
                    break;

                default:
                    isOK = true;
                    break;
            }

            if (!isOK) return interaction.user.send('Syarat tidak mencukupi!');
            data.entries.push(interaction.user.id);
            data.embed.fields[2].value = `${data.entries.length}`;

            await interaction.message.edit({ embeds: [data.embed] });
            await this.db.set(data.messageID, data);

            interaction.followUp({ content: 'Berhasil terdaftar dalam giveaway!', ephemeral: true });
            resolve();
        });
    }

    /**
     * 
     * @param {ButtonInteraction} interaction 
     */
    giveawayCancel(interaction) {
        return new Promise(async (resolve, reject) => {
            if (interaction.customId !== 'giveawayCancel') return;
            await interaction.deferUpdate();
            const data = await this.db.get(interaction.message.id);
            if (!data) return interaction.followUp({ content: 'Giveaway tidak ditemukan!', ephemeral: true });
            if (data.isDone) return interaction.followUp({ content: 'Giveaway sudah berakhir!', ephemeral: true });
            if (!data.entries.includes(interaction.user.id)) return interaction.followUp({ content: 'Kamu belum mengikuti giveaway ini!', ephemeral: true });

            data.entries.splice(data.entries.indexOf(interaction.user.id), 1);
            data.embed.fields[2].value = `${data.entries.length}`;

            await interaction.message.edit({ embeds: [data.embed] });
            await this.db.set(data.messageID, data);

            interaction.followUp({ content: 'Berhasil keluar dari giveaway!', ephemeral: true });
        });
    }

    async init() {
        setInterval(() => this.__timeHandler(), this.interval);
        this.client.on('interactionCreate', async (interaction) => {
            if (!interaction.isButton()) return;

            switch (interaction.customId) {
                case 'giveawayID':
                    this.giveawayValidator(interaction);
                    break;
                case 'giveawayCancel':
                    this.giveawayCancel(interaction);
                    break;
                default:
                    break;
            }
        });
    }
}