const { loadImage, createCanvas, CanvasRenderingContext2D } = require('canvas');
const path = require('path');

class DonaturNotification {
    constructor() {
        this.username = null;
        this.support_message = null;
        this.donation = null;
        this.avatar = null;
        this.date = null;
        this.nominal = null;
    }

    /**
     * Generate text
     * @param {CanvasRenderingContext2D} ctx CanvasRenderingContext2D
     * @param {[]} arr  Array of string
     * @param {Number} height  Height of the text
     * @param {String} template  Template of the text
     * @param {Boolean} isLast  Is the last text
     * @returns {void}
     */
    _generateText(ctx, arr, height, template, isLast = false) {
        let j = 0;
        let i = 1;

        for (const txt of arr) {
            ctx.fillStyle = '#000000';
            ctx.textAlign = 'center';

            if (i === arr.length && isLast) {
                ctx.fillText(txt + '..."', template.width / 2, height + j);
            } else {
                ctx.fillText(txt, template.width / 2, height + j);
            }

            j += 30;
            i++;
        }
    }

    /**
     * Set username
     * @param {String} username 
     * @returns {void}
     */
    setUsername(username) {
        this.username = username;
    }

    /**
     * Set support message
     * @param {String} support_message 
     * @returns {void}
     */
    setSupportMessage(support_message) {
        this.support_message = support_message;
    }

    /**
     * Set donation
     * @param {String} donation 
     * @returns {void}
     */
    setDonation(donation) {
        this.donation = donation;
    }

    /**
     * Set date
     * @param {Date} date 
     * @returns {void}
     */
    setDate(date) {
        this.date = date;
    }

    /**
     * Set nominal
     * @param {Number} nominal 
     */
    setNominal(nominal) {
        this.nominal = nominal;
    }

    /**
     * @async Set avatar
     * @param {String} avatar
     * @returns {Promise<void>}
     */
    async setAvatar(avatar) {
        if (!avatar.includes('http')) throw new Error('Avatar must be a valid URL');
        this.avatar = await loadImage(avatar);
    }

    /**
     * Generate image
     * @returns {Promise<Buffer>}
     */
    async generate() {
        if (
            !this.username ||
            !this.support_message ||
            !this.donation ||
            !this.avatar
        ) throw new Error('Please set all the required data');

        const template = await loadImage(path.join(__dirname, '..', 'templates', 'trakteer_template.png'));
        const canvas = createCanvas(template.width, template.height);

        const ctx = canvas.getContext('2d');

        const templateSize = (template.width / 2) - 440 / 2;
        ctx.drawImage(this.avatar, templateSize, 80, 440, 440);

        ctx.drawImage(template, 0, 0, template.width, template.height);

        const dates = this.date.split(' ');

        const tgl = dates[0]
        ctx.font = "30px Kollektif Bold";
        ctx.fillStyle = "#000000";
        ctx.textAlign = 'left'
        ctx.fillText(tgl.split("/").join(" / "), 30, 40);

        const jm = dates[1];
        ctx.font = "30px Kollektif";
        ctx.fillText(jm, 31, 75);

        const username = this.username;
        if (username.length > 25) {
            ctx.font = '20px Kollektif Bold';
        } else if (username.length > 17) {
            ctx.font = '25px Kollektif Bold';
        } else {
            ctx.font = '30px Kollektif Bold';
        }

        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(username, template.width - 662, template.height / 2 + 45);

        ctx.font = "27px Kollektif Bold";
        ctx.fillStyle = '#000000';
        ctx.fillText(this.nominal, template.width - 350, template.height / 2 + 45);

        const donation = this.donation;
        ctx.font = '70px Kollektif Italic';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(donation, 715, 150);

        const support_message = this.support_message;
        const limit = 40;
        const strArr = [[]];
        for (const str of support_message.split(' ')) {
            const temp = strArr[strArr.length - 1];
            if ([...temp, str].join(' ').length <= limit) {
                temp.push(str);
            } else {
                strArr.push([str]);
            }
        }
        let t = 0;
        switch (strArr.length) {
            case 1:
                t = strArr.slice(0, 1).map(x => x.join(' '));
                ctx.font = '31px Kollektif';
                this._generateText(ctx, t, 760, template);
                break;
            case 2:
                t = strArr.slice(0, 2).map(x => x.join(' '));
                ctx.font = '31px Kollektif';
                this._generateText(ctx, t, 745, template);
                break;
            case 3:
                t = strArr.slice(0, 3).map(x => x.join(' '));
                ctx.font = '30px Kollektif';
                this._generateText(ctx, t, 730, template);
                break;
            case 4:
                t = strArr.slice(0, 4).map(x => x.join(' '));
                ctx.font = '30px Kollektif';
                this._generateText(ctx, t, 715, template);
                break;
            case 5:
                t = strArr.slice(0, 5).map(x => x.join(' '));
                ctx.font = '29px Kollektif';
                this._generateText(ctx, t, 700, template);
                break;
            case 6:
                t = strArr.slice(0, 6).map(x => x.join(' '));
                ctx.font = '28px Kollektif';
                this._generateText(ctx, t, 685, template);
                break;
            default:
                t = strArr.slice(0, 6).map(x => x.join(' '));
                ctx.font = '27px Kollektif';
                this._generateText(ctx, t, 685, template, true);
                break;
        }

        // generate to buffer
        const buffer = canvas.toBuffer();

        return buffer;
    }
}

module.exports = DonaturNotification;