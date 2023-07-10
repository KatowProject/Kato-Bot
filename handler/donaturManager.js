const { Client, Message, EmbedBuilder, GuildMember, WebhookClient, AttachmentBuilder } = require('discord.js');
const { Query } = require('mongoose');
const donate = require('../database/schemas/Donatur');
const Xps = require('../database/schemas/Xp');
const DiscordCanvas = require('../modules/Discord-Canvas');
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
        this.logNotificationDev = '932997960923480099'
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
            const xp = await Xps.findOne({ id: 1 });
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
                if (!user) continue;

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
                        await this.client.selfbot.request.sendMessage(this.selfbotChannel, `!give-xp <@${member.userID}> ${parseInt(XpTotal)}`, true);

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

    async donaturLeaderboardAnnouncement() {
        try {
            // check if is new month
            const date = moment().format('DD');
            if (date !== '01') return;

            const donatur = await this.client.trakteer.getLeaderboard();
            const monthName = moment().locale('en').format('MMMM');
            const monthId = moment().locale('en').format('MM');

            const data = donatur.find(a => a.title.includes(monthName));
            const supporters = data.supporter.slice(0, 3);

            const canvas = new DiscordCanvas().loadLeaderboardDonatur();
            const guild = this.client.guilds.cache.get('932997958738268251');
            const members = await guild.members.fetch({ force: true });

            canvas.setMonth(monthId);
            canvas.setDonatur(
                supporters.map((a, i) => {
                    const unit = parseInt(a.unit);
                    const total = unit * 10000;

                    const member = members.find(b => b.user.username === a.name || b.user.tag.includes(a.name));
                    if (!member) return { username: a.name, avatar: "https://cdn.discordapp.com/attachments/932997960923480099/1127658362713165945/ikhsantai.png", donation: `Rp${total.toLocaleString()}` };

                    const avatar = member.user.displayAvatarURL({ extension: 'png', size: 4096 });
                    return { username: a.name, avatar: avatar, donation: `Rp${total.toLocaleString()}` };
                })
            );

            const buffer = await canvas.generate();
            const attachment = new AttachmentBuilder(buffer, { name: 'donatur-leaderboard.png' });

            this.client.channels.cache.get('932997960923480099').send({ files: [attachment] });

        } catch (e) {
            console.log(e);
            this.client.emit('donaturManagerError', {
                type: 'donaturLeaderboardAnnouncement',
                status: 'error',
                error: e
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
            if (message.channel.id !== this.logNotificationDev) return;
            const _data = this.client.util.isJSON(message.content) ? JSON.parse(message.content) : null;
            if (!_data) return;

            const data = await this.client.trakteer.getOrderDetail(_data.id);

            const name = data.nama;
            const value = _data.quantity;
            const nominal = data.nominal.split("v")[0].trim();
            const duration = value * 28;
            const toMS = require('ms')(`${duration}d`);
            const msg = data.message.split("\n").join(" ");
            const date = _data.created_at;

            const u_d = name.split("#");
            const username = u_d[0];
            const discriminator = u_d[1];
            const members = await message.guild.members.fetch();
            const member = members.find(m => {
                if (discriminator)
                    return m.user.tag === `${username}#${discriminator}`;
                else
                    return m.user.username === username;
            });

            const canvas = new DiscordCanvas().loadDonaturNotification();
            canvas.setUsername(name);
            canvas.setDonation(`x${value}`);
            canvas.setSupportMessage(`"${msg}"`);
            canvas.setDate(date);
            canvas.setNominal(nominal);

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
                findUser.duration = findUser.duration ?? 0 + toMS;
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
                await donate.create({ userID: member.id, guild: message.guild.id, duration: toMS, now: Date.now() });
                member.roles.add(role.id);
                channel.send(`Hai Para Staff, **${member.user.tag}** terdaftar sebagai Donatur baru, silahkan cek untuk memastikan!`);

                this.client.emit('donaturManager', {
                    type: 'addDonatur',
                    status: 'success',
                    member,
                    guild: message.guild,
                    reason: 'new donation',
                    data: { duration: toMS }
                });
            }
        } catch (err) {
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
        }, 60_000);

        this.client.on('messageCreate', this.donaturNotification.bind(this));
        console.log('[DonaturManager] running');
    }
}

module.exports = DonaturManager;