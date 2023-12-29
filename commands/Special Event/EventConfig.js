exports.run = async (client, message, args) => {
    try {
        if (!message.member.permissions.has('MANAGE_GUILD')) return message.reply('Kamu tidak memiliki izin untuk menggunakan perintah ini!');

        client.katoShop.Config(message);
    } catch (err) {
        message.channel.send({ content: 'Something wrong with: ' + err.message });
    }
};

exports.conf = {
    aliases: ['conf', 'e-config'],
    cooldown: 5
};

exports.help = {
    name: 'config',
    description: 'Mengatur event harian.',
    usage: 'config <interval> <messageCount> <channel>',
    example: 'config 1 100 #event'
};
