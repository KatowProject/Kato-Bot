const Discord = require('discord.js');
const db = require('../../database/schema/formModal');
const cooldown = new Discord.Collection();

class DiscordForm {
    constructor(obj = {}) {
        this.client = obj.client;
    }

    async createForm(message) {
        const obj = {};


        let status = "title";
        const filter = (m) => m.author.id === message.author.id;
        const collector = message.channel.createMessageCollector({ filter });

        await message.channel.send("Silahkan tulis judul form");
        collector.on('collect', async (m) => {
            switch (status) {
                case "title":
                    const title = m.content;
                    if (title < 5) return message.channel.send("Judul form minimal 5 karakter");
                    obj.title = title;
                    status = "question";

                    await message.channel.send("Silahkan tulis pertanyaan");
                    break;

                case "question":
                    if (m.content === "done") {
                        status = "isOnce";

                        return await message.channel.send("Apakah form hanya bisa diisi sekali? (y/n)");
                    }
                    const question = m.content;
                    if (question < 5) return message.channel.send("Pertanyaan form minimal 5 karakter");
                    obj.question ? obj.question.push(question) : obj.question = [question];
                    message.channel.send(`Pertanyaan ke-${obj.question.length} berhasil ditambahkan, jika sudah selesai ketik "done"`);
                    break;

                case "isOnce":
                    const isOnce = m.content.toLowerCase();
                    if (isOnce === "y") obj.isOnce = true;
                    else if (isOnce === "n") obj.isOnce = false;
                    else return message.channel.send("Pilihan hanya y/n");

                    status = "channel";
                    message.channel.send("Silahkan mention channel yang akan digunakan untuk form");
                    break;

                case "channel":
                    const channel = m.mentions.channels.first();
                    if (!channel) return message.channel.send("Channel tidak ditemukan");
                    obj.channel = channel.id;

                    status = "form-data-channel";
                    message.channel.send("Silahkan mention channel yang akan digunakan untuk menyimpan data form");
                    break;


                case "form-data-channel":
                    const formDataChannel = m.mentions.channels.first();
                    if (!formDataChannel) return message.channel.send("Channel tidak ditemukan");
                    obj.formDataChannel = formDataChannel.id;

                    collector.stop();

                    this._final(message, obj);
                    break;
            }
        });
    }

    async _final(message, obj) {
        const embed = new Discord.MessageEmbed()
            .setTitle(obj.title)
            .setDescription(obj.question.map((q, i) => `${i + 1}. ${q}`).join("\n"))
            .setFooter("Form created by " + message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        const button = [
            new Discord.MessageButton().setCustomId(`ok-form-${message.author.id}`).setLabel("Ok").setStyle("SUCCESS"),
            new Discord.MessageButton().setCustomId(`cancel-form-${message.author.id}`).setLabel("Cancel").setStyle("DANGER")
        ];

        const row = new Discord.MessageActionRow().addComponents(button);
        const msg = await message.channel.send({ embeds: [embed], components: [row], content: "Apakah form sudah benar?" });
        const filter = (i) => i.user.id === message.author.id;
        const collector = msg.createMessageComponentCollector({ filter, time: 60000 });
        collector.on('collect', async (i) => {
            if (i.customId === `ok-form-${message.author.id}`) {
                const data = await new db({
                    id: message.id,
                    title: obj.title,
                    channel: obj.channel,
                    formDataChannel: obj.formDataChannel,
                    questions: obj.question,
                    isOnce: obj.isOnce,
                    userAlreadySubmit: []
                })
                await data.save();

                const channel = this.client.channels.cache.get(obj.channel);
                const embed = new Discord.MessageEmbed()
                    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                    .setTitle(obj.title)
                    .setDescription("Untuk mengisi form, silahkan klik tombol dibawah ini")
                    .setFooter({ text: "Form created by " + message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                    .setTimestamp();

                const button = new Discord.MessageButton().setCustomId(`open-form-${message.id}`).setLabel("Isi Form").setStyle("PRIMARY");
                await channel.send({ embeds: [embed], components: [new Discord.MessageActionRow().addComponents(button)] });

                message.channel.send("Form berhasil dibuat");
            } else {
                message.channel.send("Form dibatalkan");
            }
        });
    }

    async resentForm(message) {
        const data = await db.find({});
        if (!data) return message.channel.send("Tidak ada form yang tersedia");

        const embed = new Discord.MessageEmbed()
            .setTitle("Form yang tersedia")
            .setDescription(data.map((d, i) => `${i + 1}. ${d.title}`).join("\n"))
            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })

        message.channel.send({ embeds: [embed], content: "Silahkan pilih form yang akan dikirim ulang" });

        const filter = (m) => m.author.id === message.author.id;
        const collector = message.channel.createMessageCollector({ filter });
        collector.on('collect', async (m) => {
            const index = parseInt(m.content) - 1;
            if (!data[index]) return message.channel.send("Form tidak ditemukan");

            const channel = this.client.channels.cache.get(data[index].channel);
            const embed = new Discord.MessageEmbed()
                .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                .setTitle(data[index].title)
                .setDescription("Untuk mengisi form, silahkan klik tombol dibawah ini")
                .setFooter({ text: "Form created by " + message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setTimestamp();

            const button = new Discord.MessageButton().setCustomId(`open-form-${data[index].id}`).setLabel("Isi Form").setStyle("PRIMARY");
            await channel.send({ embeds: [embed], components: [new Discord.MessageActionRow().addComponents(button)] });

            message.channel.send("Form berhasil dikirim ulang");
            collector.stop();
        });
    }

    async openForm(interaction) {
        const data = await db.findOne({ id: interaction.customId.split("-")[2] });

        const modal = new Discord.Modal()
            .setTitle(data.title)
            .setCustomId(`form-${interaction.id}`)

        for (const q of data.questions) {
            const input = new Discord.TextInputComponent()
                .setLabel(q)
                .setCustomId(`form-${interaction.id}-${q}`)
                .setRequired(true)
                .setStyle("PARAGRAPH");
            const row = new Discord.MessageActionRow().addComponents(input);
            modal.addComponents(row);
        }

        await interaction.showModal(modal);
    }

    async event(interaction) {
        if (interaction.isButton() && interaction.customId.includes("open-form")) this.openForm(interaction);

        //     if (interaction.isModalSubmit() && interaction.customId.includes("form"))// this.submitForm(interaction);
    }

    init() {
        this.client.on('interactionCreate', this.event.bind(this));
    }
}

module.exports = DiscordForm;