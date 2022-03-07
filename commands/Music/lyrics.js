const Discord = require("discord.js");
const translate = require("translate-google");
const axios = require('axios');
const langList = require("../../config/lang-gtranslate.json");

module.exports.run = async (client, message, args) => {
    try {
        const query = args.join(" ");
        if (!query) return message.reply("Permintaan tidak boleh kosong!");

        const getBySearch = await axios.get('https://genius-lirik.herokuapp.com/search/' + query + '?length=1');
        if (getBySearch.data.data.length < 1) return message.reply("Tidak dapat menemukan lirik.");

        const getSong = getBySearch.data.data.shift();
        const lyrics = getSong.lyrics;
        const texLength = lyrics.length;
        let msg;

        const embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setTitle(getSong.full_title)
            .setAuthor(getSong.artist_names, getSong.song_art_image_url, getSong.url);

        if (texLength > 2048) {
            const chunkString = client.util.chunkString(lyrics, 2048);
            embed.setDescription(chunkString.shift());

            msg = await message.channel.send({ embeds: [embed] });

            const embedExtra = new Discord.MessageEmbed().setColor("RANDOM");
            for (const chunk of chunkString) {
                embedExtra.setDescription(chunk);
                message.channel.send({ embeds: [embedExtra] });
            }
        } else {
            const btn = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId(`translate-${message.id}`)
                        .setLabel('Translate')
                        .setStyle('SECONDARY'),
                    new Discord.MessageButton()
                        .setCustomId(`romaji-${message.id}`)
                        .setLabel('Romaji')
                        .setStyle('SECONDARY')
                )
            embed.setDescription(lyrics);
            msg = await message.channel.send({ embeds: [embed], components: [btn] });
        }
        let pagination = 1;
        const collector = msg.channel.createMessageComponentCollector({
            filter: m => m.user.id === message.author.id && [`translate-${message.id}`, `romaji-${message.id}`].includes(m.customId),
            time: 60_000
        });
        collector.on("collect", async (m) => {
            await m.deferUpdate();
            switch (m.customId) {
                case `translate-${message.id}`:
                    const list = Object.entries(langList);
                    const chunk = client.util.chunk(list, 20);
                    const embedTranslate = new Discord.MessageEmbed().setColor("RANDOM").setTitle("Pilih bahasa");
                    embedTranslate.setDescription(chunk[0].map(([key, value]) => `**${key}** - ${value}`).join("\n"));

                    const buttons = new Discord.MessageActionRow()
                        .addComponents([
                            new Discord.MessageButton()
                                .setStyle('SECONDARY').setLabel('< Back').setCustomId(`back-${message.id}`),
                            new Discord.MessageButton()
                                .setStyle('SECONDARY').setLabel('Next >').setCustomId(`next-${message.id}`)
                        ]);
                    const msgTranslate = await message.channel.send({ embeds: [embedTranslate], components: [buttons] });
                    const collectorTranslate = msgTranslate.channel.createMessageComponentCollector({ filter: x => x.user.id === message.author.id, time: 60_000 });
                    collectorTranslate.on("collect", async (x) => {
                        await x.deferUpdate();
                        switch (x.customId) {
                            case `back-${message.id}`:
                                if (pagination === 1) return;
                                pagination--;
                                embedTranslate.setDescription(chunk[pagination - 1].map(([key, value]) => `**${key}** - ${value}`).join("\n"));
                                msgTranslate.edit({ embeds: [embedTranslate] });
                                break;

                            case `next-${message.id}`:
                                if (pagination === chunk.length) return;
                                pagination++;
                                embedTranslate.setDescription(chunk[pagination - 1].map(([key, value]) => `**${key}** - ${value}`).join("\n"));
                                msgTranslate.edit({ embeds: [embedTranslate] });
                                break;
                        }
                    });

                    const collectorAwaitMessage = await message.channel.awaitMessages({ filter: m => m.author.id === message.author.id, max: 1, time: 60_000, errors: ["time"] });
                    const langTranslate = list.find(([key]) => key === collectorAwaitMessage.first().content.toLowerCase());
                    if (!langTranslate) return message.reply("Tidak dapat menemukan bahasa yang dipilih.");
                    msgTranslate.delete();
                    collectorTranslate.stop();
                    collectorAwaitMessage.first().delete();

                    await translating(langTranslate[0]);
                    break;

                case `romaji-${message.id}`:
                    collector.stop();
                    client.kuroshiro.convert(lyrics, { to: "romaji", mode: "spaced" })
                        .then(function (result) {
                            embed.setDescription(result);
                            msg.edit({ embeds: [embed] });
                        });
                    break;
            }
        });

        async function translating(content) {
            const translateLyrics = await translate(lyrics, { to: content });
            embed.setDescription(translateLyrics);

            return msg.edit({ embeds: [embed] });
        }
    } catch (err) {
        console.log(err);
        return message.channel.send(err.message);
    }
}


exports.conf = {
    aliases: ["lirik"],
    cooldown: 5,
}

exports.help = {
    name: "lyrics",
    description: "lirik lagu",
    usage: "lyrics <query>",
    example: "repeat <qeury>"
}