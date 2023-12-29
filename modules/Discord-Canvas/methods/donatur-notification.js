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

    // static function fillTextWithSpacing
    static fillTextWithSpacing(ctx, text, x, y, letterSpacing = 2) {
        let currentPosition = x;
        for (let i = 0; i < text.length; i++) {
            ctx.fillText(text[i], currentPosition, y);
            currentPosition += ctx.measureText(text[i]).width + letterSpacing;
        }
    }

    static wrapText(context, text, x, y, maxWidth, lineHeight) {
        var words = text.split(' ');
        var line = '';
        var lineCount = 0;
        var lines = [];

        for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = context.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                lines.push(line);
                line = words[n] + ' ';
            }
            else {
                line = testLine;
            }
        }
        lines.push(line);

        // Adjust y to place text in the middle of the box
        y = y - (lines.length - 1) * lineHeight / 2;

        for (var i = 0; i < lines.length; i++) {
            context.fillText(lines[i], x, y + i * lineHeight);
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

        const template = await loadImage(path.join(__dirname, '..', 'templates', 'POSDonation.png'));
        const canvas = createCanvas(template.width, template.height);

        const ctx = canvas.getContext('2d');

        // px
        const avatarX = 270.72 * 0.1654583333;
        const avatarY = 269.79 * 0.1654583333;
        const avatarSize = 445;

        ctx.drawImage(this.avatar, avatarX, avatarY, avatarSize, avatarSize);

        ctx.drawImage(template, 0, 0, template.width, template.height);

        // Monument font
        const donation = this.donation;
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = 'center';
        // if value is more than 100, resize
        if (donation >= 100) {
            ctx.font = "32.5px MonumentExtended Regular";
            ctx.fillText(donation, 570, 380);
        } else {
            ctx.font = "40px MonumentExtended Regular";
            ctx.fillText(donation, 570, 380);
        }
        ctx.textAlign = 'left';

        // Name
        ctx.font = "30px Montserrat Bold";
        ctx.fillStyle = "#000000";
        const username = this.username.toUpperCase();
        // if text length more than 15, split and give text end with ...
        // if (username.length > 15) {
        //     const split = username.split('');
        //     const first = split.slice(0, 15).join('');
        //     const last = split.slice(15, username.length).join('');
        //     ctx.fillText(`${first}...`, 715, 87);
        // } else {
        ctx.fillText(username, 715, 87);
        // }


        const nameWidth = ctx.measureText(username).width;

        ctx.font = "30px Montserrat Medium";
        ctx.fillText("HAS DONATED...", 715 + nameWidth + 10, 87);


        // nominal
        const nominal = this.nominal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        // if value is 1.000.000 or more, use 70px font size
        if (nominal.length >= 8) {
            ctx.font = "80px MonumentExtended Ultrabold";
        } else {
            ctx.font = "100px MonumentExtended Ultrabold";
        }
        ctx.fillStyle = '#39a0e5';
        // letter spacing 0.8px
        DonaturNotification.fillTextWithSpacing(ctx, nominal, 810, 180, 80 * 0.05);

        // support message
        const support_message = this.support_message;
        ctx.font = "25px Montserrat SemiBold";
        ctx.fillStyle = "#000000";
        ctx.textAlign = 'center';
        DonaturNotification.wrapText(ctx, support_message, 1040, 335, 622, 30);

        const date = this.date;
        // get with format DD/MM/YYYY
        const tgl = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'numeric', year: 'numeric' });
        // get time HH:MM
        const jam = date.toLocaleTimeString('id-ID', { hour: 'numeric', minute: 'numeric' });

        // date
        ctx.font = "20px Montserrat Regular";
        ctx.fillStyle = "#000000";
        ctx.textAlign = 'center';
        ctx.fillText(`${tgl} - ${jam}`, 935, template.height - 35);

        // generate to buffer
        const buffer = canvas.toBuffer();

        return buffer;
    }
}

module.exports = DonaturNotification;