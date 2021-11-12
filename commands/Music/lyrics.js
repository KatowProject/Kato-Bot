const Discord = require("discord.js");
const translate = require("translate-google");
const { MessageButton } = require("discord-buttons");
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
        const TranslateButton = new MessageButton().setLabel("Translate").setStyle("grey").setID("translate");
        const RomajiButton = new MessageButton().setLabel("Romaji").setStyle("grey").setID("romaji");

        if (texLength > 2048) {
            const chunkString = client.util.chunkString(lyrics, 2048);
            embed.setDescription(chunkString.shift());

            await message.channel.send(embed);

            const embedExtra = new Discord.MessageEmbed().setColor("RANDOM");
            for (const chunk of chunkString) {
                embedExtra.setDescription(chunk);
                message.channel.send(embedExtra);
            }
        } else {
            embed.setDescription(lyrics);
            msg = await message.channel.send({ embed, button: [TranslateButton, RomajiButton] });
        }
        let pagination = 1;

        const backwardsButton = new MessageButton().setStyle('grey').setLabel('< Back').setID('backID');
        const forwardsButton = new MessageButton().setStyle('grey').setLabel('Next >').setID('nextID');
        const buttonList = [backwardsButton, forwardsButton];

        const collector = msg.createButtonCollector(button => button.clicker.user.id === message.author.id, { time: 500000 });
        collector.on("collect", async (button) => {
            button.reply.defer();
            switch (button.id) {
                case "translate":
                    const list = Object.entries(langList);
                    const chunk = client.util.chunk(list, 20);
                    const embedTranslate = new Discord.MessageEmbed().setColor("RANDOM").setTitle("Pilih bahasa");
                    embedTranslate.setDescription(chunk[0].map(([key, value]) => `**${key}** - ${value}`).join("\n"));

                    const msgTranslate = await message.channel.send({ embed: embedTranslate, buttons: client.util.buttonPageFilter(buttonList, chunk, pagination) });
                    const collectorTranslate = msgTranslate.createButtonCollector(button => button.clicker.user.id === message.author.id, { time: 500000 });
                    collectorTranslate.on("collect", async (button) => {
                        button.reply.defer();
                        switch (button.id) {
                            case 'backID':
                                if (pagination === 1) return;
                                pagination--;
                                embedTranslate.setDescription(chunk[pagination - 1].map(([key, value]) => `**${key}** - ${value}`).join("\n"));
                                msgTranslate.edit({ embed: embedTranslate, buttons: client.util.buttonPageFilter(buttonList, chunk.length, pagination) });
                                break;

                            case 'nextID':
                                if (pagination === chunk.length) return;
                                pagination++;
                                embedTranslate.setDescription(chunk[pagination - 1].map(([key, value]) => `**${key}** - ${value}`).join("\n"));
                                msgTranslate.edit({ embed: embedTranslate, buttons: client.util.buttonPageFilter(buttonList, chunk.length, pagination) });
                                break;
                        }
                    });

                    const collectorAwaitMessage = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 60000, errors: ["time"] });
                    const langTranslate = list.find(([key]) => key === collectorAwaitMessage.first().content.toLowerCase());
                    if (!langTranslate) return message.reply("Tidak dapat menemukan bahasa yang dipilih.");
                    msgTranslate.delete();
                    collectorAwaitMessage.first().delete();

                    await translating(langTranslate[0]);
                    break;

                case "romaji":
                    client.kuroshiro.convert(lyrics, { to: "romaji", mode: "spaced" })
                        .then(function (result) {
                            embed.setDescription(result);
                            msg.edit({ embed });
                        })
                    break;
            }
        });

        async function translating(content) {
            const translateLyrics = await translate(lyrics, { to: content });
            embed.setDescription(translateLyrics);

            return msg.edit({ embed });
        }


    } catch (err) {
        console.log(err);
        return message.channel.send(err.message);
    }
}


exports.conf = {
    aliases: ["lirik"],
    cooldown: 5
}

exports.help = {
    name: "lyrics",
    description: "lirik lagu",
    usage: "lyrics <query>",
    example: "repeat <qeury>"
}