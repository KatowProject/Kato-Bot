exports.run = (client, message, args) => {
    try {
        if (!message.member.permissions.has('ManageGuild')) return message.reply('Only Staff can use this command!');
        client.donaturManager.donaturXp(true);
        reset(client, true).finally(() => {
            message.reply('Daily has been reset!');
        });
    } catch (err) {
        message.reply(`Something went wrong!\n\`\`\`${err}\`\`\``);
    }
};

exports.conf = {
    aliases: [],
    cooldown: 5,
    location: __filename
};

exports.help = {
    name: 'resetdaily',
    description: 'Reset Daily Message',
    usage: 'resetDaily',
    example: 'resetDaily',
}