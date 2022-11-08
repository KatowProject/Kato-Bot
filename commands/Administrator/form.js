const Discord = require("discord.js");

exports.run = async (client, message, args) => {
    if (!message.member.permissions.has("MANAGE_GUILD")) return message.channel.send("Kamu tidak memiliki izin untuk menggunakan command ini!");

    const embed = new Discord.MessageEmbed()
        .setTitle("Menu Form")
        .setDescription("Silahkan pilih menu form yang ingin kamu gunakan!")
        .addFields([
            { name: "Create Form", value: "Membuat form baru", inline: true },
            { name: "Resent Form", value: "Mengirim ulang form", inline: true },
        ]);

    const buttons = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageButton()
                .setCustomId(`create_form-${message.id}`)
                .setLabel('Create Form 📜')
                .setStyle('PRIMARY'),
            new Discord.MessageButton()
                .setCustomId(`resent_form-${message.id}`)
                .setLabel('Resent Form 📨')
                .setStyle('PRIMARY'),
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