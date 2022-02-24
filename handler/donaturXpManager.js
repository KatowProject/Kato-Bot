const db = require('../database/schema/Donatur');
const xpdb = require('../database/schema/xp_player');
const moment = require('moment');
const Discord = require('discord.js');
moment.locale('id');

module.exports = async (client, canReset = false) => {
    try {
        const datas = await db.find({});
        const xp = await xpdb.findOne({ id: 1 });

        const arr = [];
        const time = moment().format('HH:mm');
        for (const member of datas) {
            const getUser = xp.data.find(a => a.id === member.userID);
            if (!getUser) {
                member.remove();

                continue;
            }
            member.message.base = member.message.base ? member.message.base : getUser.message_count;
            member.message.daily = getUser.message_count - member.message.base;

            if (time === '24:00' || time === '00:00' || canReset) {
                const guild = client.guilds.cache.get(member.guild);
                const user = await guild.members.cache.get(member.userID);
                if (!user?.roles.cache.hasAny('932997958788608044', '933117751264964609')) {
                    arr.push(member);

                    client.users.cache.get(member.userID).send(`Hai, Status donatur kamu dicabut karna durasi donasi kamu telah habis.`);
                    client.channels.cache.find(a => a.name === 'staff-bot').send({ content: 'true - donatur, out/no role' });

                    member.remove();
                    continue;
                }
                arr.push({ userID: member.userID, guild: member.guild, daily: `${member.message.daily}` });

                member.message = { daily: 0, base: getUser.message_count };
                member.isAttend = false;
            };

            await member.save();
        }

        if (arr.length > 1) {
            console.log(arr);
            const map = arr.map(async a => {
                const member = await client.guilds.cache.get(a.guild).members.cache.get(a.userID);
                if (!member) return;
                const xp = (parseInt(a.daily) * 10) * 0.25;

                return `**${member.user.tag} [${member.id}]** - \`${xp}\` XP`;
            });

            client.channels.cache.get('932997960923480101').send({
                embeds: [
                    new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('Daily Message Reset - Donatur & Booster')
                        .setDescription(`${await Promise.all(map).then(a => a.join('\n'))}`)
                        .setFooter('Daily Message Reset')
                        .setTimestamp()
                ]
            });
        }
    } catch (err) {
        console.log(err);
        client.channels.cache.get('932997960923480099').send(`[Error Donatur XP Manager] ${err.message}`);
    }
};