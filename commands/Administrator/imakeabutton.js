const { MessageButton, MessageActionRow } = require('discord-buttons');

exports.run = async (client, message, args) => {
    let button = new MessageButton()
        .setStyle('red')
        .setLabel('My First Button!')
        .setID('1');

    const buttonMsg = await message.channel.send('Hey, i am powered by https://npmjs.com/discord-buttons', button);

    const collector = await buttonMsg.createButtonCollector(button => button.clicker.user.id === message.author.id, { time: 50000, error: ['time'] });


    collector.on('collect', (button) => {
        message.channel.send('You clicked the button!');
    })



}

exports.conf = {
    aliases: [],
    cooldown: 5,
    permissions: ['ADMINISTRATOR']
}

exports.help = {
    name: 'button',
    description: 'imakeadbutton',
    usage: 'button',
    example: 'button'
}