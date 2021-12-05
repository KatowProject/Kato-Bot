const Discord = require('discord.js');
const ms = require('ms');
const db = require('../../database/schema/Giveaway');

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
                    console.log(m.content);
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
                                    label: 'MEE6',
                                    description: 'Menggunakan Level MEE6',
                                    value: 'MEE6'
                                },
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
                                console.log(data.values);
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

                        await db.create({
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
}