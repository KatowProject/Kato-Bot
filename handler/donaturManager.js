const { Client, EmbedBuilder, GuildMember } = require('discord.js');
const { Query } = require('mongoose');
const donate = require('../database/schemas/Donatur');
const Xps = require('../database/schemas/Xp');
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Jakarta').locale('id');

class DonaturManager {
    /**
     * @param {Client} client
     */
    constructor(client) {
        this.client = client;
        this.intervalLength = 60_000;
        this.selfbotChannel = '932997960923480099';
        this.donaturRole = '932997958788608044';
        this.donaturRole2 = '933117751264964609';
    }

    static convertXp(xp) {
        const xpTotal = (parseInt(xp) * 10) * 0.25;

        return xpTotal;
    }

    /**
     * 
     * @param {GuildMember} member
     * @param {Number} duration 
     */
    async addDonaturBooster(member) {
        try {
            const xp = await xpdb.findOne({ id: 1 });
            const getUser = xp.data.find(a => a.id === member.user.id);
            if (!getUser) return;

            const user = await donate.findOne({ userID: member.user.id });
            if (user) return;

            await donate.create({ userID: member.user.id, guild: member.guild.id, message: { daily: 0, base: getUser.message_count }, isAttend: false, isBooster: true });
            this.client.emit('donaturManager', {
                type: 'addDonaturBooster',
                member,
                guild: member.guild,
                status: 'success',
                reason: 'booster'
            });
        } catch (e) {
            this.client.emit('donaturManagerError', {
                type: 'addDonaturBooster',
                status: 'error',
                error: e
            });
        }
    }

    async donaturDuration() {
        try {
            /**
             * @type {Array<Query>}
             * @param {Query} donatur
             */
            const donaturs = await donate.find({});
            for (const donatur of donaturs) {
                const guild = this.client.guilds.cache.get(donatur.guild);
                const member = guild.members.cache.get(donatur.userID);
                if (member.roles.cache.has(this.donaturRole2)) {
                    if (!donatur.isBooster) await donatur.updateOne({ isBooster: true });
                    continue;
                }

                const timeLatest = Date.now() - donatur.now;
                if (timeLatest > donatur.duration) {
                    if (member) await member.roles.remove(this.donaturRole);
                    this.client.emit('donaturManager', {
                        type: 'donaturDuration',
                        member: member,
                        guild: guild,
                        status: 'expired',
                        reason: 'duration'
                    });

                    await donatur.remove();
                }
            }
        } catch (e) {
            this.client.emit('donaturManagerError', {
                type: 'donaturDuration',
                status: 'error',
                error: e
            });
        }
    }

    async donaturXp(canReset = false) {
        try {
            const arr = [];
            const time = moment().format('HH:mm');

            const donatur = await donate.find({});
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
                    const guild = this.client.guilds.cache.get(member.guild)
                    const user1 = await guild.members.fetch({ id: member.userID, force: true });
                    if (!user1.roles.cache.hasAny(this.donaturRole, this.donaturRole2)) {
                        arr.push({ userID: member.userID, guild: member.guild, daily: `${member.message.daily}` });
                        this.client.emit('donaturManager', {
                            type: 'donaturXp',
                            member: user1,
                            guild: guild,
                            status: 'no role',
                            reason: 'out/no role'
                        });

                        const XpTotal = DonaturManager.convertXp(member.message.daily);
                        this.client.selfbot.request.sendMessage(this.selfbotChannel, `!give-xp <@${member.userID}> ${XpTotal}`, true);

                        await member.remove();
                        continue;
                    }

                    arr.push({ userID: member.userID, guild: member.guild, daily: `${member.message.daily}` });

                    member.message = { daily: 0, base: user.message_count };
                    member.isAttend = false;

                    const XpTotal = convertXp(member.message.daily);
                    this.client.selfbot.request.sendMessage(this.selfbotChannel`!give-xp <@${member.userID}> ${XpTotal}`, true);
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

            this.client.channels.cache.get('932997960923480101').send({ embeds: [embed] });
        } catch (err) {
            console.log(err);
            this.client.emit('donaturManagerError', {
                type: 'donaturXp',
                status: 'error',
                error: err
            });
        }
    }

    init() {
        setInterval(() => {
            this.donaturDuration();
            this.donaturXp();
        }, 30_000);
        console.log('[DonaturManager] running');
    }
}

module.exports = DonaturManager;