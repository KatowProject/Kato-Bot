const Discord = require('discord.js');
const { MessageButton } = require('discord-buttons');
const ms = require('ms');
const db = require('../../database/schema/Giveaway');

exports.run = async (client, message, args) => {

    const option = args[0];
    const embed = new Discord.MessageEmbed()
    const embedReq = new Discord.MessageEmbed().setTitle('Opsi Dibutuhkan').setColor(client.warna.warning);
    if (!message.member.roles.cache.has('473869471183011860') || !message.member.hasPermission('MANAGE_MESSAGES')) return message.reply('Not Enough Permission!');

    switch (option) {
        case 'create':
            const temporaly = {};

            const alertChannel = await message.reply('Pilih channel yang ingin dibuat Giveaway!');
            let alertTime = null;
            let alertWinner = null;
            let alertTitle = null;
            let alertMee6 = null;
            let alertRole = null;
            let alertRequire = null;
            let alertFinal = null;

            let cases = 'channel';
            const channelRequest = await message.channel.createMessageCollector(msg => msg.author.id === message.author.id, { time: 150000 });
            channelRequest.on('collect', async (m) => {
                switch (cases) {
                    case 'channel':
                        if (m.mentions.channels.size === 0) return message.reply('Invalid Channel!').then(t => t.delete({ timeout: 5000 }));
                        alertChannel.delete();
                        temporaly.channel = m.mentions.channels.first().id;

                        cases = 'time';
                        alertTime = await message.reply(`<#${m.mentions.channels.first().id}> menjadi tempat Giveaway, selanjutnya silahkan masukkan durasi Giveaway!`);
                        break;

                    case 'time':
                        const timelist = m.content.split(' ');
                        const totalTime = [];
                        for (const time of timelist) {
                            if (!ms(time)) return message.reply('Invalid Time!').then(t => t.delete({ timeout: 5000 }));
                            totalTime.push(ms(time));
                        }


                        alertTime.delete();
                        temporaly.time = totalTime.reduce((a, c) => a + c);

                        cases = 'winner';
                        alertWinner = await message.reply(`Giveaway berdurasi **${client.util.parseDur(temporaly.time)}**, selanjutnya masukkan jumlah pemenang!`);
                        break;

                    case 'winner':
                        if (!parseInt(m.content)) return message.reply('Invalid Winner!').then(t => t.delete({ timeout: 5000 }));
                        alertWinner.delete();
                        temporaly.winner = m.content;

                        cases = 'require';
                        embedReq.addField('Level MEE6', 'Ketik `1` untuk menggunakan Level MEE6');
                        embedReq.addField('Role', 'Ketik `2` untuk menggunakan Role');
                        embedReq.addField('None', 'Ketik `3` untuk yang tidak memiliki syarat apapun');

                        alertRequire = await message.reply('Pilih menggunakan angka!', embedReq);
                        break;

                    case 'require':

                        if (!parseInt(m.content)) return message.reply('Invalid Option!').then(t => t.delete({ timeout: 5000 }));
                        alertRequire.delete();

                        const opsiReq = embedReq.fields;
                        const reqOpsi = opsiReq[m.content - 1];

                        if (!reqOpsi) return message.reply('Nilai Invalid!').then(t => t.delete({ timeout: 5000 }));

                        switch (m.content) {

                            case '1':
                                cases = 'mee6';
                                alertMee6 = await message.reply('Silahkan masukkan Level MEE6!');
                                break;

                            case '2':
                                cases = 'roles';
                                alertRole = await message.reply('Silahkan masukkan role yang ingin dimasukkan (Name, RoleID)\n**Contoh**: santai dermawan, nitro boost, santai');
                                break;
                            case '3':
                                cases = 'title';
                                temporaly.require = { name: 'None', value: 'Tidak ada syarat' };
                                alertTitle = await message.reply('Masukkan Judulnya!');
                                break;
                        };
                        break;

                    case 'mee6':
                        if (!parseInt(m.content)) return message.reply('Harus bernilai angka!');
                        temporaly.require = { name: 'MEE6', value: m.content };
                        cases = 'title';
                        alertTitle = await message.reply('Masukkan Judulnya!');
                        break;

                    case 'roles':
                        const query = m.content;
                        const roles = query.split(',');
                        temporaly.require = { name: 'Roles', value: [] };

                        const roleTemp = temporaly.require.value;
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

                        cases = 'title';
                        alertTitle = await message.reply('Masukkan judulnya!');
                        break;
                    case 'title':
                        if (m.content.length < 10) return message.reply('Setidaknya isi Judul sebanyak 10 karakter!').then(t => t.delete({ timeout: 5000 }));
                        alertTitle.delete();
                        temporaly.title = m.content;

                        cases = 'final';

                        const reqName = temporaly.require;
                        if (reqName.name === 'MEE6') {
                            embed.addField('Dibutuhkan:', `Level MEE6 - **${reqName.value}**`);
                        } else if (reqName.name === 'Roles') {
                            embed.addField('Dibutuhkan:', `Role ${reqName.value.map(a => `<@&${a}>`).join(', ')}`);
                        } else {
                            embed.addField('Dibutuhkan:', '**Tidak ada**');
                        };

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
                            return channelRequest.stop();
                        };

                        if (m.content !== 'ya') return message.reply('ketik **ya** jika sudah yakin, ketik **cancel** untuk membatalkan!');
                        alertFinal.delete();

                        const buttonsEntries = new MessageButton().setID('giveawayID2').setLabel('🎉').setStyle('green');
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
                            require: temporaly.require,
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

            const mapData = giveawayDataList.map(a => `[${a.messageID}](https://discord.com/channels/${a.guildID}/${a.channelID}/${a.messageID}) - ${a.embed.description} | ${a.isDone ? 'Telah Selesai' : 'Belum Selesai'}`);
            const chunkData = client.util.chunk(mapData, 10);

            let pagination = 1;
            const embede = new Discord.MessageEmbed().setColor(client.warna.kato).setTitle('Giveaways List');
            embede.setDescription(chunkData[pagination - 1]);
            embede.setFooter(`Page ${pagination} of ${chunkData.length}`);

            const backwardsButton = new MessageButton().setStyle('grey').setLabel('< Back').setID('backID');
            const deleteButton = new MessageButton().setStyle('red').setLabel('♻').setID('deleteID');
            const forwardsButton = new MessageButton().setStyle('grey').setLabel('Next >').setID('nextID');
            const buttonList = [backwardsButton, deleteButton, forwardsButton];
            let r = await message.channel.send({ embed: embede, buttons: client.util.buttonPageFilter(buttonList, chunkData.length, pagination) });

            const collector = r.createButtonCollector(button => button.clicker.user.id === message.author.id, { time: 500000 });
            collector.on('collect', (button) => {
                button.reply.defer();
                switch (button.id) {
                    case 'backID':
                        if (pagination === 1) return;
                        pagination--;

                        embede.setDescription(chunkData[pagination - 1].join('\n'));
                        embede.setFooter(`Page ${pagination} of ${chunkData.length}`);

                        r.edit({ embed: embede, buttons: client.util.buttonPageFilter(buttonList, chunkData.length, pagination) });
                        break;

                    case 'deleteID':
                        r.delete();
                        break;

                    case 'nextID':
                        if (pagination === chunkData.length) return;
                        pagination++;

                        embede.setDescription(chunkData[pagination - 1].join('\n'));
                        embede.setFooter(`Page ${pagination} of ${chunkData.length}`);

                        r.edit({ embed: embede, buttons: client.util.buttonPageFilter(buttonList, chunkData.length, pagination) });
                        break;
                }
            });
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

        case 'delete':
            if (!args[1]) return message.reply('Message ID required!');
            const giveawayDataDelete = await db.findOne({ messageID: args[1] });
            if (!giveawayDataDelete) return message.reply('Not Found!');
            if (!giveawayDataDelete.isDone) return message.reply(`Giveaway isn't over yet, pls end giveaway first!`).then(a => a.delete({ timeout: 5000 }));

            await db.findOneAndDelete({ messageID: giveawayDataDelete.messageID });
            message.reply(`Telah selesai dihapus!`);
            break;
        default:
            message.reply('Opsi tidak dimengerti oleh Kato!');
            break;
    };

};

exports.conf = {
    aliases: ['ga'],
    cooldown: 10
};

exports.help = {
    name: 'giveaway',
    description: 'buat giveaway',
    usage: 'giveaway',
    example: 'giveaway'
}