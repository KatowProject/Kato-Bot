const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Message } = require("discord.js");

/**
 * @param {Client} client
 * @param {Message} message
 * @param {[]} args
 */

exports.run = async (client, message, args) => {
    if (!message.member.permissions.has("ManageChannels")) return message.channel.send("Kamu tidak memiliki izin untuk menggunakan command ini!");

    const embed = new EmbedBuilder()
        .setTitle("Menu Form")
        .setDescription("Silahkan pilih menu form yang ingin kamu gunakan!")
        .addFields([
            { name: "Create Form", value: "Membuat form baru", inline: true },
            { name: "Resent Form", value: "Mengirim ulang form", inline: true },
        ]);

    const buttons = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`create_form-${message.id}`)
                .setLabel('Create Form 📜')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId(`resent_form-${message.id}`)
                .setLabel('Resent Form 📨')
                .setStyle(ButtonStyle.Primary)
        );

    const msg = await message.channel.send({ embeds: [embed], components: [buttons] });
    const filter = i => i.customId.startsWith('create_form') || i.customId.startsWith('resent_form') && i.user.id === message.author.id;
    const collector = msg.createMessageComponentCollector({ filter, time: 15000 });
    collector.on('collect', async i => {
        switch (i.customId) {
            case `create_form-${message.id}`:
                await i.deferUpdate();
                client.form.createForm(message);

                break;

            case `resent_form-${message.id}`:
                await i.deferUpdate();
                client.form.resentForm(message);
                break;

            default:
                break;
        }
    });
}

exports.conf = {
    aliases: [],
    cooldown: 5
}

exports.help = {
    name: 'form',
    description: 'Membuat form baru',
    usage: 'form',
    example: 'form'
}