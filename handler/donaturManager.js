const { Client, Message, EmbedBuilder, GuildMember, WebhookClient, AttachmentBuilder } = require('discord.js');
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
        this.logNotification = '932997960923480102';
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

    /**
     * Handle donatur duration
     */
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

    /**
     * Handle donatur xp
     * @param {Boolean} canReset
     * if you need to reset without waiting for the time, set it to true  
     */
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
                    const user1 = guild.members.cache.get(member.userID);
                    if (!user1.roles?.cache.hasAny(this.donaturRole, this.donaturRole2)) {
                        arr.push({ userID: member.userID, guild: member.guild, daily: `${member.message.daily}` });
                        this.client.emit('donaturManager', {
                            type: 'donaturXp',
                            member: user1 || member.userID,
                            guild: guild,
                            status: 'no role',
                            reason: 'out/no role'
                        });

                        const XpTotal = DonaturManager.convertXp(member.message.daily);
                        await this.client.selfbot.request.sendMessage(this.selfbotChannel, `!give-xp <@${member.userID}> ${XpTotal}`, true);

                        // sleep 2 seconds
                        await new Promise(resolve => setTimeout(resolve, 2000));

                        await member.remove();
                        continue;
                    }

                    arr.push({ userID: member.userID, guild: member.guild, daily: `${member.message.daily}` });

                    const XpTotal = DonaturManager.convertXp(member.message.daily);
                    await this.client.selfbot.request.sendMessage(this.selfbotChannel, `!give-xp <@${member.userID}> ${parseInt(XpTotal)}`, true);

                    member.message = { daily: 0, base: user.message_count };
                    member.isAttend = false;

                    await member.save();
                    continue;
                }
                await member.save();
            }

            if (!arr.length > 0) return;
            const embed = new EmbedBuilder()
                .setTitle('Daily Reset')
                .setColor('#00ff00')
                .setDescription(`${arr.map(a => `<@${a.userID}> [${a.userID}] - ${DonaturManager.convertXp(a.daily)}`).join('\n')}`)
                .setFooter({ text: `Total: ${arr.length} donatur` })
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

    /**
     * donaturNotification handler, bind this event to messageCreate
     * @param {Message} message 
     * Discord Message Type
     * @param {*} data 
     * Data from donatur
     * @returns {Promise<void>}
     */
    async donaturNotification(message) {
        try {
            if (message.channel.id !== this.logNotification) return;
            const data = this.client.util.isJSON(message.content) ? JSON.parse(message.content) : null;
            if (!data) return;

            const name = data.nama;
            const value = data.unit.length.split('x').pop().trim();
            const nominal = data.nominal.split("v")[0].trim();
            const duration = value * 28;
            const toMS = require('ms')(`${duration}d`);
            const msg = data.message.split("\n").join(" ");
            const date = data.date;
            const members = await message.guild.members.fetch();
            const member = members.find(m => m.user.tag.toLowerCase() === name.toLowerCase());

            const canvas = this.client.canvas;
            canvas.setUsername(name);
            canvas.setDonation(`x${value}`);
            canvas.setSupportMessage(`"${msg}"`);
            canvas.setDate(date);
            canvas.setNominal(nominal);

            await canvas.setTemplate();
            if (member)
                await canvas.setAvatar(member.user.displayAvatarURL({ extension: 'png', size: 4096 }));
            else
                await canvas.setAvatar("https://cdn.discordapp.com/attachments/1013977865756356658/1041700094598193253/santai1.png");

            const buffer = await canvas.generate();
            const attachment = new AttachmentBuilder(buffer, { name: 'donatur.png' });
            // example webhook link
            // https://discord.com/api/webhooks/9939213919399312/RbjPOqDO8CV-xARfAxPe0j12313dsadsa555ffgeeacrgc$#d
            const id = process.env.TRAKTEER_NOTIFICATION_WEBHOOK.split("/")[5];
            const token = process.env.TRAKTEER_NOTIFICATION_WEBHOOK.split("/")[6];
            const webhook = new WebhookClient({ id, token });
            webhook.send({ files: [attachment] });

            if (!member) return this.client.emit('donaturManagerError', {
                type: 'donaturNotification',
                status: 'error',
                error: 'member not found',
                guild: message.guild,
            });

            const role = message.guild.roles.cache.find(r => r.name === 'Santai Dermawan');
            if (!role) return this.client.emit('donaturManagerError', {
                type: 'donaturNotification',
                status: 'error',
                error: 'role not found',
                guild: message.guild,
            });

            const findUser = await donate.findOne({ userID: member.id });
            const channel = message.guild.channels.cache.get('1013977865756356658');
            if (findUser) {
                findUser.duration = findUser.duration + toMS;
                await findUser.save();
                channel.send(`Hai Para Staff, Donatur **${member.user.tag}** telah diperpanjang durasinya selama **${duration} hari**.`);

                this.client.emit('donaturManager', {
                    type: 'addDonatur',
                    member,
                    guild: message.guild,
                    status: 'extend',
                    reason: 'extend donation',
                    data: {
                        duration: toMS,
                    }
                });
            } else {
                console.log(toMS);
                await donate.create({ userID: member.id, guild: message.guild.id, duration: toMS, now: Date.now() });
                member.roles.add(role.id);
                channel.send(`Hai Para Staff, **${member.user.tag}** terdaftar sebagai Donatur baru, silahkan cek untuk memastikan!`);

                this.client.emit('donaturManager', {
                    type: 'addDonatur',
                    status: 'success',
                    member,
                    guild: message.guild,
                    reason: 'new donation',
                });
            }
        } catch (err) {
            console.log(err);
            this.client.emit('donaturManagerError', {
                type: 'donaturNotification',
                status: 'error',
                error: err
            });
        }
    }

    /**
     * Handle donatur attend
     */
    init() {
        setInterval(() => {
            this.donaturDuration();
            this.donaturXp();
        }, 30_000);

        this.client.on('messageCreate', this.donaturNotification.bind(this));
        this.client.on('guildMemberBoost', this.addDonaturBooster.bind(this));

        console.log('[DonaturManager] running');
    }
}

module.exports = DonaturManager;