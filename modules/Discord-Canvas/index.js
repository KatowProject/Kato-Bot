const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
registerFont(path.join(__dirname, 'font', 'Kollektif.ttf'), { family: 'Kollektif' });
registerFont(path.join(__dirname, 'font', 'Kollektif-Bold.ttf'), { family: 'Kollektif-Bold' });
registerFont(path.join(__dirname, 'font', 'Kollektif-Italic.ttf'), { family: 'Kollektif-Italic' });

class Canvas {
    constructor() {
        this.username = null;
        this.support_message = null;
        this.donation = null;
        this.template = null;
        this.avatar = null;
        this.date = null;
        this.nominal = null;
    }

    _generateText(ctx, arr, height, isLast = false) {
        let j = 0;
        let i = 1;

        for (const txt of arr) {
            ctx.fillStyle = '#000000';
            ctx.textAlign = 'center';

            if (i === arr.length && isLast) {
                ctx.fillText(txt + '..."', this.template.width / 2, height + j);
            } else {
                ctx.fillText(txt, this.template.width / 2, height + j);
            }

            j += 30;
            i++;
        }
    }

    setUsername(username) {
        this.username = username;
    }

    setSupportMessage(support_message) {
        this.support_message = support_message;
    }

    setDonation(donation) {
        this.donation = donation;
    }

    setDate(date) {
        this.date = date;
    }

    setNominal(nominal) {
        this.nominal = nominal;
    }

    async setAvatar(avatar) {
        if (!avatar.includes('http')) throw new Error('Avatar must be a valid URL');
        this.avatar = await loadImage(avatar);

        return true;
    }

    async setTemplate() {
        this.template = await loadImage(path.join(__dirname, 'trakteer_template.png'));

        return true;
    }

    async generate() {
        if (
            !this.username ||
            !this.support_message ||
            !this.donation ||
            !this.template ||
            !this.avatar
        ) throw new Error('Please set all the required data');

        const canvas = createCanvas(this.template.width, this.template.height);
        const ctx = canvas.getContext('2d');

        const templateSize = (this.template.width / 2) - 440 / 2;
        ctx.drawImage(this.avatar, templateSize, 80, 440, 440);

        ctx.drawImage(this.template, 0, 0, this.template.width, this.template.height);

        const dates = this.date.split(' ');

        const tgl = dates[0]
        ctx.font = "30px Kollektif-Bold";
        ctx.fillStyle = "#000000";
        ctx.textAlign = 'left'
        ctx.fillText(tgl.split("/").join(" / "), 30, 40);

        const jm = dates[1];
        ctx.font = "30px Kollektif";
        ctx.fillText(jm, 31, 75);

        const username = this.username;
        if (username.length > 25) {
            ctx.font = '20px Kollektif-Bold';
        } else if (username.length > 17) {
            ctx.font = '25px Kollektif-Bold';
        } else {
            ctx.font = '30px Kollektif-Bold';
        }

        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(username, this.template.width - 662, this.template.height / 2 + 45);

        ctx.font = "27px Kollektif-Bold";
        ctx.fillStyle = '#000000';
        ctx.fillText(this.nominal, this.template.width - 350, this.template.height / 2 + 45);

        const donation = this.donation;
        ctx.font = '70px Kollektif-Italic';
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
                this._generateText(ctx, t, 760);
                break;
            case 2:
                t = strArr.slice(0, 2).map(x => x.join(' '));
                ctx.font = '31px Kollektif';
                this._generateText(ctx, t, 745);
                break;
            case 3:
                t = strArr.slice(0, 3).map(x => x.join(' '));
                ctx.font = '30px Kollektif';
                this._generateText(ctx, t, 730);
                break;
            case 4:
                t = strArr.slice(0, 4).map(x => x.join(' '));
                ctx.font = '30px Kollektif';
                this._generateText(ctx, t, 715);
                break;
            case 5:
                t = strArr.slice(0, 5).map(x => x.join(' '));
                ctx.font = '29px Kollektif';
                this._generateText(ctx, t, 700);
                break;
            case 6:
                t = strArr.slice(0, 6).map(x => x.join(' '));
                ctx.font = '28px Kollektif';
                this._generateText(ctx, t, 685);
                break;
            default:
                t = strArr.slice(0, 6).map(x => x.join(' '));
                ctx.font = '27px Kollektif';
                this._generateText(ctx, t, 685, true);
                break;
        }

        // generate to buffer
        const buffer = canvas.toBuffer();

        return buffer;
    }

    toJSON() {
        return {
            username: this.username,
            support_message: this.support_message,
            donation: this.donation,
            date: this.date,
            nominal: this.nominal,
            avatar: this.avatar,
            template: this.template,
        };
    }
}

module.exports = Canvas;