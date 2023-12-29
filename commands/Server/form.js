const { Client, Message, EmbedBuilder } = require("discord.js");

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {*} args 
 */
exports.run = async (client, message, args) => {
    if (!message.member.permissions.has("MuteMembers")) return message.channel.send("You don't have permission to use this command.");

    const option = args[0];
    switch (option) {
        case "create":
            client.form.create(message);
            break;
        case "resent":
            client.form.resentForm(message);
            break;
        default:
            const embed = new EmbedBuilder()
                .setColor("Random")
                .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                .addFields({ name: "Create a form", value: `\`k!form create\`` }, { name: "Resent a form", value: `\`k!form resent\`` })
            message.channel.send({ embeds: [embed] });
    }
};

exports.conf = {
    cooldown: 5,
    aliases: [],
}

exports.help = {
    name: "form",
    description: "Create a form",
    usage: "form",
    example: "form"
};