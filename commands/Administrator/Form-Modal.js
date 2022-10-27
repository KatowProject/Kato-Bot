const { Modal, MessageActionRow, TextInputComponent, MessageButton } = require('discord.js');

exports.run = async (client, message, args) => {
    try {
        const button = new MessageButton().setCustomId('open-modal').setLabel('Open Modal').setStyle('PRIMARY');
        const msg = await message.channel.send({ content: 'Click the button to open the modal!', components: [new MessageActionRow().addComponents(button)] });

        const filter = i => i.customId === 'open-modal';
        const collector = msg.createMessageComponentCollector({ filter, time: 15000 });
        collector.on('collect', async interaction => {
            const modal = new Modal()
                .setCustomId('myModal')
                .setTitle('My Modal');
            // Add components to modal
            // Create the text input components
            const favoriteColorInput = new TextInputComponent()
                .setCustomId('favoriteColorInput')
                // The label is the prompt the user sees for this input
                .setLabel("What's your favorite color?")
                // Short means only a single line of text
                .setStyle('SHORT');
            const hobbiesInput = new TextInputComponent()
                .setCustomId('hobbiesInput')
                .setLabel("What's some of your favorite hobbies?")
                // Paragraph means multiple lines of text.
                .setStyle('PARAGRAPH');
            // An action row only holds one text input,
            // so you need one action row per text input.
            const firstActionRow = new MessageActionRow().addComponents(favoriteColorInput);
            const secondActionRow = new MessageActionRow().addComponents(hobbiesInput);
            // Add inputs to the modal
            modal.addComponents(firstActionRow, secondActionRow);
            // Show the modal to the user
            await interaction.showModal(modal);
        });
    } catch (err) {
        message.channel.send(`An error has occured: ${err.message}`)
    }
}

exports.conf = {
    cooldown: 5,
    aliases: [],
}

exports.help = {
    name: 'form-modal',
    description: 'Form Modal',
    usage: 'form-modal',
    example: 'form-modal'
}