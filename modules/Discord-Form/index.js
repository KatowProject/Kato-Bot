const {
    EmbedBuilder, ModalBuilder, TextInputStyle, ActionRowBuilder,
    TextInputBuilder, ButtonBuilder, ButtonStyle, BaseInteraction,
    Collection, Client, Message, ThreadAutoArchiveDuration
} = require('discord.js');
const db = require('../../database/schemas/Form');
const cooldown = new Collection();

class DiscordForm {
    /**
     * 
     * @param {Client} client 
     */
    constructor(client) {
        this.client = client;
    }

    /**
     * 
     * @param {Message} message 
     */
    create(message) {
        this.__createEvent(message);
    }


    /**
     * 
     * @param {Message} message 
     */
    async __createEvent(message) {
        const collector = message.channel.createMessageCollector({ filter: m => m.author.id === message.author.id && m.channel.id === message.channel.id, time: 240_000 });

        const obj = {};
        let _ = "title";

        message.channel.send('**Masukkan judul form:**');

        collector.on('collect', async (m) => {
            if (m.content === 'cancel') return collector.stop('cancel');
            if (m.content === 'finish') return collector.stop('finish');

            switch (_) {
                case 'title':
                    const title = m.content;
                    if (title.length > 100) return message.channel.send('Judul tidak boleh lebih dari 100 karakter.');

                    obj.title = title;

                    message.channel.send('**Masukkan deskripsi form:**');
                    _ = 'description';
                    break;

                case 'description':
                    const description = m.content;
                    if (description.length > 1000) return message.channel.send('Deskripsi tidak boleh lebih dari 1000 karakter, silahkan isi kembali.');

                    obj.description = description;

                    message.channel.send('**Apakah form ini hanya bisa diisi sekali? (yes/no)**');
                    _ = 'isOnce';
                case 'isOnce':
                    const isOnce = m.content;
                    if (isOnce.toLowerCase() === 'yes') {
                        obj.isOnce = true;
                    } else if (isOnce.toLowerCase() === 'no') {
                        obj.isOnce = false;
                    } else {
                        return message.channel.send('Mohon isi dengan benar.');
                    }

                    message.channel.send('**Masukkan channel untuk form ini:**');
                    _ = 'channel';
                    break;

                case 'channel':
                    const channel = m.mentions.channels.first() || message.guild.channels.cache.get(m.content);
                    if (!channel) return message.channel.send('Channel tidak ditemukan, silahkan isi kembali.');

                    obj.channel = channel.id;

                    message.channel.send('**Masukkan channel untuk form response:**');
                    _ = 'formResponseChannel';
                    break;

                case 'formResponseChannel':
                    const formResponseChannel = m.mentions.channels.first() || message.guild.channels.cache.get(m.content);
                    if (!formResponseChannel) return message.channel.send('Channel tidak ditemukan, silahkan isi kembali.');

                    obj.formResponseChannel = formResponseChannel.id;

                    message.channel.send('**Masukkan pertanyaan untuk form ini:**');
                    _ = 'questions';
                    break;

                case 'questions':
                    if (m.content === 'finish') return collector.stop('finish');

                    const question = m.content;
                    if (question.length > 100) return message.channel.send('Pertanyaan tidak boleh lebih dari 100 karakter.');

                    obj.question ? obj.question.push(question) : obj.question = [question];

                    message.channel.send(`Pertaanyaan berhasil ditambahkan, ketik \`finish\` untuk menyelesaikan form ini atau ketik lagi untuk menambahkan pertanyaan lainnya.`);

                    break;

                default:
                    break;
            }
        });

        collector.on('end', async (collected, reason) => {
            if (reason === 'time') return message.channel.send('You took too long to respond. Please try again.');
            if (reason === 'cancel') return message.channel.send('Successfully cancelled the form creation.');

            if (obj.question.length < 1) return message.channel.send('Form tidak dapat dibuat karena tidak ada pertanyaan.');

            const embed = new EmbedBuilder()
                .setAuthor({ name: 'Form Preview' })
                .setTitle(obj.title)
                .setDescription(obj.description)
                .setColor('Random')
                .setTimestamp()
                .setFooter({ text: `Form ini hanya bisa diisi sekali: ${obj.isOnce ? 'Ya' : 'Tidak'}` });

            obj.question.forEach((q, i) => {
                embed.addFields({ name: `Pertanyaan ${i + 1}`, value: q });
            });

            message.channel.send({ embeds: [embed], content: 'Apakah form ini sudah benar? (yes/no)' });

            const confirm = await message.channel.awaitMessages({ filter: m => m.author.id === message.author.id && m.channel.id === message.channel.id, max: 1, time: 30000 });
            if (!confirm.first()) return message.channel.send('You took too long to respond. Please try again.');
            const decision = confirm.first().content.toLowerCase();

            if (decision === 'cancel') return message.channel.send('Successfully cancelled the form creation.');

            if (decision === 'yes') {
                const embed = new EmbedBuilder()
                    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                    .setTitle(obj.title)
                    .setDescription(obj.description)
                    .setColor('Random')

                const btn = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`open-form-${message.id}`)
                            .setLabel('Open Form')
                            .setStyle(ButtonStyle.Secondary)
                    );

                message.guild.channels.cache.get(obj.channel).send({ embeds: [embed], components: [btn] });


                const form = new db({
                    formId: message.id,
                    questionData: {
                        title: obj.title,
                        channel: obj.channel,
                        formDataChannel: obj.formResponseChannel,
                        questions: obj.question,
                        isOnce: obj.isOnce
                    }
                })

                await form.save();

                message.channel.send('Form berhasil dibuat.');
            }
        });
    }

    /**
     * 
     * @param {BaseInteraction} interaction 
     */
    async openForm(interaction) {
        if (!interaction.isButton() && !interaction.customId.startsWith('open-form')) return;
        const formId = interaction.customId.split('-')[2];

        const form = await db.findOne({ formId });
        if (!form) return interaction.reply({ content: 'Form tidak ditemukan.', ephemeral: true });

        // check isOnce
        if (form.questionData.isOnce) {
            const userId = interaction.user.id;
            // check is exits
            if (form.answers.some((a) => a.userId === userId)) return interaction.reply({ content: 'Kamu sudah mengisi form ini.', ephemeral: true });
        }


        if (!cooldown.has(form.id)) {
            cooldown.set(form.id, new Collection());
        }

        const now = Date.now();
        const timestamps = cooldown.get(form.id);
        const coolddown = 60_000;

        if (timestamps.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id) + coolddown;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return interaction.reply({ content: `Tunggu ${timeLeft.toFixed(1)} detik sebelum menggunakan form ini lagi.`, ephemeral: true });
            }
        }

        const modal = new ModalBuilder()
            .setTitle(form.questionData.title)
            .setCustomId(`submitform-${interaction.customId.split('-')[2]}`)

        for (const q of form.questionData.questions) {
            const input = new TextInputBuilder()
                .setLabel(q)
                .setCustomId(`${q}`)
                .setRequired(true)
                .setStyle(TextInputStyle.Paragraph)

            const row = new ActionRowBuilder().addComponents(input);

            modal.addComponents(row);
        }

        await interaction.showModal(modal);
    }


    /**
     * 
     * @param {BaseInteraction} interaction 
     */
    async submitForm(interaction) {
        if (!interaction.isModalSubmit()) return;
        if (!interaction.customId.includes('submitform')) return;

        const formId = interaction.customId.split('-')[1];
        const form = await db.findOne({ formId });

        const obj = {};
        obj.userId = interaction.user.id;
        obj.arr_answer = [];
        for (const [i, v] of interaction.fields.components.entries()) {
            const value = v.components[0].value;
            obj.arr_answer.push({ question: form.questionData.questions[i], answer: value });
        }

        form.answers.push(obj);

        const { user } = await interaction.guild.members.fetch({ user: obj.userId });
        const embed = new EmbedBuilder()
            .setColor('Random')
            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ dynamic: true }) })
            .addFields(...obj.arr_answer.map(a => ({ name: a.question, value: a.answer })))
            .setTimestamp();

        const formDataChannel = interaction.guild.channels.cache.get(form.questionData.formDataChannel);
        const thread = await formDataChannel.threads.cache.find(a => a.name === `form-${formId}`);
        if (thread) {
            await thread.send({ content: `Jawaban dari <@${interaction.user.id}>`, embeds: [embed] });
        } else {
            const thread = await formDataChannel.threads.create({
                name: `form-${formId}`,
                autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
                reason: 'Form Thread'
            });

            await thread.send({ content: `Jawaban dari <@${interaction.user.id}>`, embeds: [embed] });
        }

        await form.save();
        interaction.reply({ content: 'Form berhasil diisi.', ephemeral: true });
    }

    /**
     * 
     * @param {Message} message 
     * @returns 
     */
    async resentForm(message) {
        const data = await db.find({});
        if (!data) return message.channel.send("Tidak ada form yang tersedia");

        const embed = new EmbedBuilder()
            .setTitle("Form yang tersedia")
            .setDescription(data.map((d, i) => `${i + 1}. ${d.questionData.title} \`[${d.formId}]\``).join("\n"))
            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })

        message.channel.send({ embeds: [embed], content: "Silahkan pilih form yang akan dikirim ulang" });

        const filter = (m) => m.author.id === message.author.id;
        const collector = message.channel.createMessageCollector({ filter });
        collector.on('collect', async (m) => {
            const index = parseInt(m.content) - 1;
            if (!data[index]) return message.channel.send("Form tidak ditemukan");

            const channel = this.client.channels.cache.get(data[index].questionData.channel);
            const embed = new EmbedBuilder()
                .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                .setTitle(data[index].questionData.title)
                .setDescription("Untuk mengisi form, silahkan klik tombol dibawah ini")
                .setTimestamp();

            const button = new ButtonBuilder().setCustomId(`open-form-${data[index].formId}`).setLabel("Isi Form").setStyle(ButtonStyle.Primary);
            await channel.send({ embeds: [embed], components: [new ActionRowBuilder().addComponents(button)] });

            message.channel.send("Form berhasil dikirim ulang");
            collector.stop();
        });
    }

    init() {
        this.client.on('interactionCreate', async (interaction) => {
            if (interaction.isButton()) {
                this.openForm(interaction);
            }

            if (interaction.isModalSubmit()) {
                this.submitForm(interaction);
            }
        });
    }
}

module.exports = DiscordForm;