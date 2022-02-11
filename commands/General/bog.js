const Discord = require('discord.js');

exports.run = async (client, message, args) => {
    const roll = args[0];
    if (!roll) return message.reply('Kamu harus memasukkan jumlah roll!');
    if (parseInt(roll) > 10) return message.reply('Jumlah roll tidak boleh lebih dari 10!');

    const items = gachaLogic(roll);
    const embed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setTitle(`Roll ${roll}`)
        .setDescription(items.join('\n'));
    message.channel.send(embed);

    function gachaLogic(roll) {
        const ssr_rate = 5;
        const sr_rate = 15;
        const r_rate = 80;

        let weight = ssr_rate + sr_rate + r_rate;
        let random = () => Math.floor(Math.random() * weight);

        const items = [];
        for (i = 1; i <= roll; i++) {
            const r = random();
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
    cooldown: 180,
    location: __filename
}

exports.help = {
    name: 'bog',
    description: 'Gacha',
    usage: 'bog',
    example: 'bog'
}