const { loadImage, createCanvas } = require('canvas');
const path = require('path');
const moment = require('moment');

class LeaderboardDonatur {
    constructor() {
        this.donaturs = [];
        this.month = null;
        this.template = null;
    }

    /**
     * Set month
     * @param {Number} month Number of month
     * @returns {void}
     * @example
     * leaderboardDonatur.setMonth(1); // January
    */
    setMonth(month) {
        if (month < 1 || month > 12) throw new Error('Month must be between 1 and 12');

        this.month = moment().month(month - 1).format('MMMM').toUpperCase();
    }

    /**
     * Set donatur to leaderboard
     * @param {Object | Array<Object>} data Donatur data
     * @returns {void} 
     */
    setDonatur(data) {
        if (this.donaturs.length >= 3) throw new Error('Donatur maximum is 3');

        if (Array.isArray(data)) {
            for (const donatur of data) {
                this._validateDonatur(donatur);

                this.donaturs.push(donatur);
            }

            return;
        } else {
            this._validateDonatur(data);

            this.donaturs.push(data);
        }
    }

    /**
     * Generate image
     * @returns {Promise<Buffer>}
     * @example
     * const buffer = await leaderboardDonatur.generate();
     * fs.writeFileSync('test.png', buffer);
     * @example
     * const buffer = await leaderboardDonatur.generate();
     * const attachment = new Discord.AttachmentBuilder(buffer, 'test.png');
     * message.channel.send({ files: [attachment] });
     * 
    */
    async generate() {
        if (!this.month) throw new Error('Month is required');

        const template = await loadImage(path.join(__dirname, '..', 'templates', 'POS_Top_Donations.png'));
        const canvas = createCanvas(template.width, template.height);

        const ctx = canvas.getContext('2d');

        // draw donatur
        await this._applyAvatarDonatur(ctx, template);

        ctx.drawImage(template, 0, 0);

        // draw month semi bold
        ctx.font = '32px Montserrat Bold';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.fillText(this.month + ' 2023', template.width / 2, 180);

        // create text
        this._applyText(ctx, template);


        // to buffer
        const buffer = canvas.toBuffer();

        return buffer;
    }

    async _applyAvatarDonatur(ctx, template) {
        const donatur1 = this.donaturs[0];
        if (!donatur1) return;
        const avatar = await loadImage(donatur1.avatar);
        ctx.drawImage(avatar, template.width / 2 - 120, template.height / 2 - 142, 244, 244);

        const donatur2 = this.donaturs[1];
        if (!donatur2) return;
        const avatar2 = await loadImage(donatur2.avatar);
        ctx.drawImage(avatar2, 78, template.height / 2 - 21, 220, 220);

        const donatur3 = this.donaturs[2];
        if (!donatur3) return;
        const avatar3 = await loadImage(donatur3.avatar);
        ctx.drawImage(avatar3, template.width - 298, template.height / 2 - 21, 220, 220);
    }

    _applyText(ctx, template) {
        const donatur1 = this.donaturs[0];
        if (!donatur1) return;

        ctx.font = '26px Montserrat SemiBold';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.fillText(donatur1.username, template.width / 2, template.height / 2 + 145);

        ctx.font = '30px Montserrat BoldItalic';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.fillText(donatur1.donation, template.width / 2, template.height / 2 + 187.5);

        const donatur2 = this.donaturs[1];
        if (!donatur2) return;

        ctx.font = '26px Montserrat SemiBold';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.fillText(donatur2.username, 185, template.height / 2 + 227);

        ctx.font = '30px Montserrat BoldItalic';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.fillText(donatur2.donation, 185, template.height / 2 + 272);

        const donatur3 = this.donaturs[2];
        if (!donatur3) return;
        ctx.font = '26px Montserrat SemiBold';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.fillText(donatur3.username, template.width - 185, template.height / 2 + 227);

        ctx.font = '30px Montserrat BoldItalic';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.fillText(donatur3.donation, template.width - 185, template.height / 2 + 272);
    }

    _validateDonatur(donatur) {
        if (!donatur.username) throw new Error('Username is required');
        if (!donatur.avatar) throw new Error('Avatar is required');
        if (!donatur.donation) throw new Error('Donation is required');
    }
}

module.exports = LeaderboardDonatur;