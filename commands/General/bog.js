const Discord = require('discord.js');

exports.run = async (client, message, args) => {
    const roll = args[0];
    if (!roll) return message.reply('Kamu harus memasukkan jumlah roll!');
    if (parseInt(roll) > 10) return message.reply('Jumlah roll tidak boleh lebih dari 10!');

    const items = gachaLogic(roll);
    const embed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setTitle(`Bog - Gacha`)
        .setDescription(items.join('\n'))
        .setFooter(`Roll: ${roll}`);
    message.channel.send({ embeds: [embed] });

    function gachaLogic(roll) {
        const ssr_rate = 0.6;
        const sr_rate = 5.1;
        const r_rate = 94.3;

        let weight = ssr_rate + sr_rate + r_rate;
        let random = () => Math.random() * weight;

        const items = [];
        for (i = 1; i <= roll; i++) {
            const r = random().toFixed(2);
            if (r < ssr_rate) {
                items.push(`**SSR** di roll ke-${i} | **${r}**%`);
            } else if (r < ssr_rate + sr_rate) {
                items.push(`**SR** di roll ke-${i} | **${r}**%`);
            } else if (r < ssr_rate + sr_rate + r_rate) {
                items.push(`**R** di roll ke-${i} | **${r}**%`);
            } else {
                items.push(`**SSR** di roll ke-${i} | **${r}**%`);
            }
        }

        return items;
    }
};

exports.conf = {
    aliases: [],
    cooldown: 5,
    location: __filename
}

exports.help = {
    name: 'bog',
    description: 'Gacha',
    usage: 'bog',
    example: 'bog'
}