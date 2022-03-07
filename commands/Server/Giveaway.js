exports.run = async (client, message, args) => {
    const option = args[0].toLowerCase();

    if (!message.member.roles.cache.has('932997958759227458')) {
        if (!message.member.permissions.has('MANAGE_MESSAGES')) return message.reply('Not Enough Permission!');
    };

    switch (option) {
        case 'create':
            await client.giveaway.create(message);
            break;

        case 'reroll':
            await client.giveaway.reroll(message, args);
            break;

        case 'list':
            await client.giveaway.getData(message, args);
            break;

        case 'end':
            await client.giveaway.end(message, args);
            break;

        case 'delete':
            await client.giveaway.delete(message, args);
    }

};

exports.conf = {
    aliases: ['ga'],
    cooldown: 5,
    location: __filename
}

exports.help = {
    name: 'giveaway',
    description: 'giveaway',
    usage: 'giveaway',
    example: 'giveaway'
}