const { MessageEmbed } = require('discord.js');
const db = require('../database/schema/eventParticipations');

module.exports = async (client, message) => {
    const welcomeBed = new MessageEmbed().setColor(client.warna.kato).setAuthor('Perkumpulan Orang Santai', 'https://cdn.discordapp.com/icons/336336077755252738/2204fd32e2a63da40789044ed3bb179c.png?size=4096');
    welcomeBed.setDescription('Hai, Selamat Datang di portal pendaftaran POS Idol!\nSebelum memulai harap baca Syarat & Ketentuan yang ada di gambar untuk mengikuti event ini:');
    welcomeBed.setImage('https://cdn.discordapp.com/attachments/795771950076133438/863799150609301544/pos_idol-01.png');

    const welcomeMsg = await message.reply(welcomeBed);
    await welcomeMsg.react('✔');

    const alertMsg = await message.reply('Jika sudah memahami Syarat & Ketentuan, Kamu bisa react ✔ untuk melanjutkan!');
    let finalName = null;
    let finalSong = null;

    const agree = welcomeMsg.createReactionCollector((reaction, user) => reaction.emoji.name === '✔');
    agree.on('collect', async (f) => {
        message.delete();
        await welcomeMsg.delete();
        await alertMsg.delete();

        const getUser = await db.findOne({ userID: message.author.id });
        if (getUser) return message.reply('Kamu sudah terdaftar dalam event ini, jika ingin mengubah data silahkan ketik `edit` di DM Bot Kato');
        await handlerMessageCollector();

    });

    async function handlerMessageCollector() {

        const alertName = await message.reply('Silahkan masukkan nama kamu!');
        const name = await message.channel.createMessageCollector((m) => m.author.id === message.author.id, { time: 200000 });
        name.on('collect', async f => {
            const decisionOptions = { agree: ['iya', 'ya', 'setuju', 'bener'], disagree: ['nggak', 'tidak', 'salah'] };
            if (!decisionOptions.agree.includes(f.content.toLowerCase())) finalName = f.content;

            if (decisionOptions.agree.includes(f.content.toLowerCase())) {
                name.stop();
                alertName.delete();
                message.reply('telah tersimpan oleh bot kato!').then((msg) => msg.delete({ timeout: 2000 }));
                return await getSong()
            }

            if (decisionOptions.disagree.includes(f.content)) {
                return message.reply('Silahkan masukin lagi namanya!');
            }

            message.reply(`Apakah kamu sudah yakin dengan nama **${f.content}**?\n\n**Setuju**: \`${decisionOptions.agree.join(', ')}\`\n**Tidak Setuju**: \`${decisionOptions.disagree.join(', ')}\``);

        });

        async function getSong() {
            const alertSong = await message.reply('Silahkan masukkan lagu yang ingin kamu nyanyikan!');
            const song = await message.channel.createMessageCollector((m) => m.author.id === message.author.id, { time: 200000 });

            song.on('collect', async f => {

                const decisionOptions = { agree: ['iya', 'ya', 'setuju', 'bener'], disagree: ['nggak', 'tidak', 'salah'] };
                if (!decisionOptions.agree.includes(f.content.toLowerCase())) finalSong = f.content;

                if (decisionOptions.agree.includes(f.content.toLowerCase())) {
                    song.stop();
                    alertSong.delete();
                    message.reply('telah tersimpan oleh bot kato!').then((msg) => msg.delete({ timeout: 2000 }));

                    return finalDecision();
                }

                if (decisionOptions.disagree.includes(f.content)) {
                    return message.reply('Silahkan masukin lagi namanya!');
                }

                await message.reply(`Apakah kamu sudah yakin dengan lagu **${f.content}**?\n\n**Setuju**: \`${decisionOptions.agree.join(', ')}\`\n**Tidak Setuju**: \`${decisionOptions.disagree.join(', ')}\``);
            });
        }

        async function finalDecision() {
            const embedDecision = new MessageEmbed().setColor(client.warna.warning).setAuthor('Perkumpulan Orang Santai', 'https://cdn.discordapp.com/icons/336336077755252738/2204fd32e2a63da40789044ed3bb179c.png?size=4096').setTitle('Data User');
            embedDecision.addField('Nama: ', finalName);
            embedDecision.addField('Tag: ', `${message.author.tag} | ${message.author.id}`);
            embedDecision.addField('Lagu: ', finalSong);

            const decisonMsg = await message.reply(embedDecision);
            await decisonMsg.react('✔');
            await decisonMsg.react('✖');
            await decisonMsg.react('🔄');
            const alertDecisonMsg = await message.reply('**PERINGATAN**\nDisaat H-1 harus wajib datang, Apakah kamu sudah yakin?');

            const finalSetuju = decisonMsg.createReactionCollector((reaction, user) => reaction.emoji.name === '✔');
            const finalTidak = decisonMsg.createReactionCollector((reaction, user) => reaction.emoji.name === '✖');
            const finalReload = decisonMsg.createReactionCollector((reaction, user) => reaction.emoji.name === '🔄');

            finalSetuju.on('collect', async f => {
                await db.create({ userID: message.author.id, realName: finalName, songSelection: finalSong });
                decisonMsg.delete();
                alertDecisonMsg.delete();
                message.reply('Pendaftaran telah berhasil, jika ingin mengubah data silahkan ketik `edit`');
            });

            finalTidak.on('collect', f => {
                decisonMsg.delete();
                alertDecisonMsg.delete();
                message.reply('Pendaftaran dibatalkan!');
            });

            finalReload.on('collect', async f => {
                decisonMsg.delete();
                alertDecisonMsg.delete();
                await handlerMessageCollector();
            });
        }
    }



}