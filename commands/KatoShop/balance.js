const { Message, EmbedBuilder } = require("discord.js");
const Client = require("../../core/ClientBuilder");

/**
 * @param {Client} client
 * @param {Message} message
 * @param {Array} args
 */
exports.run = async (client, message) => {
    const user = message.author;

    try {
        const data = await client.katoShop.user.balance(user);

        const embed = new EmbedBuilder()
            .setTitle(`Balance ${user.tag}`)
            .setAuthor({
                name: message.guild.name,
                iconURL: message.guild.iconURL(),
            })
            .setDescription(`
            **🎟️ Ticket:** ${data.ticket}
            **💬 Message Count:** ${data.messageCount}/${client.katoShop.option.messageCount}
            **🗓️ Daily Attendence:** ${data.isAttend ? "🟢" : "🔴"}
            `)
            .setColor("Random")
            .setTimestamp()
            .setFooter({
                text: "Kato Shop",
                iconURL: client.user.displayAvatarURL(),
            });

        message.reply({
            embeds: [embed],
        });
    } catch (e) {
        message.reply(`Gagal mengambil data user, \`${e}\``);
    }
};

exports.conf = {
    aliases: [],
    cooldown: 5,
    location: __filename,
};

exports.help = {
    name: "balance",
    description: "balance",
    usage: "balance",
    example: "balance",
};
