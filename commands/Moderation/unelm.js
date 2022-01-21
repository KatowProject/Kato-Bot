const Discord = require('discord.js');
const ELM = require('../../database/schema/ELMs');
const { Permissions } = Discord;

exports.run = async (client, message, args) => {
    try {
        if (!message.guild.me.permissions.has(Permissions.FLAGS.MUTE_MEMBERS)) return message.channel.send("Aku tidak mempunyai akses!");

        let korban = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!korban) return message.channel.send("tag user yang ingin di unelm!");

        //cari data
        const member = await ELM.findOne({ userID: korban.id });
        if (!member) return message.reply('Member gk kena ELM!');

        for (const user of member.roles) {
            korban.roles.add(user);
        }

        let ELMs = message.guild.roles.cache.find(a => a.name == "ELM");
        korban.roles.remove(ELMs).then(() => {
            message.delete()
            message.channel.send(`**${korban.user.username}#${korban.user.discriminator}** telah selesai di unelm.`)
        })
        await ELM.findOneAndDelete({ userID: korban.id });

        let embed = new Discord.MessageEmbed()
            .setAuthor(`UNELM | ${korban.user.tag}`)
            .setColor('RANDOM')
            .addField("User", `${korban.id}`, true)
            .addField("Moderator", `${message.author.id}`, true)
            .setTimestamp()
            .setFooter(`${message.member.id}`, message.guild.iconURL)

        client.channels.cache.get(client.config.channel["warn-activity"]).send({ embeds: [embed] });
    } catch (error) {
        return message.channel.send(`Something went wrong: ${error.message}`);
        // Restart the bot as usual.
    }
}

exports.conf = {
    aliases: ["bebas"],
    cooldown: 5,
    location: __filename
}

exports.help = {
    name: 'unelm',
    description: 'melepaskan role ELM',
    usage: 'k!unelm <user>',
    example: 'k!unelm @juned'
}