const { loadImage, createCanvas, CanvasRenderingContext2D } = require('canvas');
const path = require('path');

class BoosterNotification {
    constructor() {
        this.username = null;
        this.avatar = null;
        this.date = null;
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
     * Set date
     * @param {Date} date 
     * @returns {void}
     */
    setDate(date) {
        this.date = date;
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
            !this.date ||
            !this.avatar
        ) throw new Error('Please set all the required data');

        const template = await loadImage(path.join(__dirname, '..', 'templates', 'POSBooster.png'));
        const canvas = createCanvas(template.width, template.height);

        const ctx = canvas.getContext('2d');

        // px
        const avatarX = 270.72 * 0.1654583333;
        const avatarY = 269.79 * 0.1654583333;
        const avatarSize = 445;

        ctx.drawImage(this.avatar, avatarX, avatarY, avatarSize, avatarSize);

        ctx.drawImage(template, 0, 0, template.width, template.height);

        // Name
        ctx.font = "30px Montserrat Bold";
        ctx.fillStyle = "#000000";
        const username = this.username.toUpperCase();
        ctx.fillText(username, 715, 190);


        const nameWidth = ctx.measureText(username).width;

        ctx.font = "30px Montserrat Medium";
        ctx.fillText("HAS...", 715 + nameWidth + 10, 190);

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

module.exports = BoosterNotification;