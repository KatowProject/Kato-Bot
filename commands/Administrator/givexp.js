exports.run = async (client, message, args) => {
    if (!message.member.permissions.has('ADMINISTRATOR')) return message.reply('You don\'t have permission to use this command!');
    const messageid = args[0];
    if (!messageid) return message.channel.send('Please provide a message ID');
    const channel = client.channels.cache.get('932997960923480101');

    const msg = await channel.messages.fetch(messageid);
    if (!msg) return message.reply('Message not found');

    const embed = msg.embeds[0];
    const description = embed.description.split('\n');
    const xps = description;
    for (xp of xps) {
        const userID = xp.split('[')[1].split(']')[0];
        let exp = xp.split('`')[1];
        if (exp === 'NaN') exp = 0;
        client.selfbot.request.sendMessage(message.channel.id, `!give-xp <@${userID}> ${parseInt(exp)}`, true);

        //delay 3s
        await new Promise(resolve => setTimeout(resolve, 3000));
    }
    await message.channel.send('Telah dikirim ke semua user');
};

exports.conf = {
    aliases: [],
    cooldown: 5
}

exports.help = {
    name: 'givexp',
    description: 'givexp for donatur',
    usage: 'givexp',
    example: 'givexp'
}