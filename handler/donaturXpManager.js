const Donaturs = require('../database/schemas/Donatur');
const Xps = require('../database/schemas/Xp');
const moment = require('moment');
const { EmbedBuilder } = require('discord.js');
moment.locale('id');

module.exports = (client, canReset = false) => {
    const run = async () => {
        try {
            function convertXp(xp) {
                const xpTotal = (parseInt(xp) * 10) * 0.25;

                return xpTotal;
            }

            const arr = [];
            const time = moment().format('HH:mm');

            const donatur = await Donaturs.find({});
            const xp = await Xps.findOne({ id: 1 });

            for (const member of donatur) {
                const user = xp.data.find(a => a.id === member.userID);
                if (!user) {
                    await member.remove();

                    continue;
                }

                member.message.base = member.message.base ? member.message.base : user.message_count;
                member.message.daily = user.message_count - member.message.base;

                if (time === '24:00' || time === '00:00' || canReset) {
                    const isMemberOrRoleExist = await client.guilds.cache.get(member.guild).members.cache.get(member.userID);
                    if (!isMemberOrRoleExist?.roles.cache.hasAny('932997958788608044', '933117751264964609')) {
                        arr.push({ userID: member.userID, guild: member.guild, daily: `${member.message.daily}` });

                        client.users.cache.get(member.userID)?.send(`Hai <@${member.userID}>, Status donasi kamu telah direset. Terima Kasih atas dukungannya.`);
                        client.channels.cache.find(a => a.name === 'staff-bot').send({ content: 'true - donatur, out/no role' });

                        const XpTotal = convertXp(member.message.daily);
                        client.selfbot.request.sendMessage('932997960923480099', `!give-xp <@${member.userID}> ${XpTotal}`, true);

                        await member.remove();
                        continue;
                    }

                    arr.push({ userID: member.userID, guild: member.guild, daily: `${member.message.daily}` });

                    member.message = { daily: 0, base: user.message_count };
                    member.isAttend = false;

                    const XpTotal = convertXp(member.message.daily);
                    client.selfbot.request.sendMessage('932997960923480099', `!give-xp <@${member.userID}> ${XpTotal}`, true);
                }
                await member.save();
            }

            if (!arr.length > 0) return;
            const embed = new EmbedBuilder()
                .setTitle('Daily Reset')
                .setColor('#00ff00')
                .setDescription(`${arr.map(a => `<@${a.userID}> [${a.userID}] - ${convertXp(a.daily)}`).join('\n')}`)
                .setFooter('Daily Reset')
                .setTimestamp();

            client.channels.cache.get('932997960923480101').send({ embeds: [embed] });
        } catch (err) {
            console.log(err);
            client.channels.cache.find(a => a.name === 'staff-bot').send(`[Error DonaturXpManager] ${err.message}`);
        }

    }

    console.log('[DonaturXpManager] Running');
    setInterval(run, 60_000);
}