class Util {
    constructor() {
        this.numberString = function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        };

        this.resolveRoles = function resolveRoles(role, name) {
            let reg = new RegExp("^(?:<@​&?)?([0-9]+)>?$");
            if (!name || name === undefined) return undefined;
            if (reg.test(name)) name = name.replace(reg, "$1");
            let roles = roles.filter(r =>
                r.name.toLowerCase().includes(name && name.toLowerCase())
            );
            if (roles) return roles.first();
            else return undefined;
        };

        this.resolveMembers = function resolveMembers(member, name) {
            let reg = new RegExp("^(?:<@​&?)?([0-9]+)>?$");
            if (!name || name === undefined) return undefined;
            if (reg.test(name)) name = name.replace(reg, "$1");
            let members = member.filter(r =>
                r.user.username.toLowerCase().includes(name && name.toLowerCase())
            );
            if (member) return members.first();
            else return undefined;
        };

        this.timeParser = function timeParser(time) {
            let days = Math.floor((time % 31536000) / 86400);
            let hours = Math.floor(((time % 31536000) % 86400) / 3600);
            let minutes = Math.floor((((time % 31536000) % 86400) % 3600) / 60);
            let seconds = Math.round((((time % 31536000) % 86400) % 3600) % 60);
            days = days > 9 ? days : "0" + days;
            hours = hours > 9 ? hours : "0" + hours;
            minutes = minutes > 9 ? minutes : "0" + minutes;
            seconds = seconds > 9 ? seconds : "0" + seconds;
            return (
                (parseInt(days) > 0 ? days + ":" : "") +
                (parseInt(hours) === 0 && parseInt(days) === 0 ? "" : hours + ":") +
                minutes +
                ":" +
                seconds
            );
        };

        this.shuffle = function shuffle(array) {
            const arr = array.slice(0);
            for (let i = arr.length - 1; i >= 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                const temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
            return arr;
        };

        this.shufflelist = function list(arr, conj = "and") {
            const len = arr.length;
            return `${arr.slice(0, -1).join(", ")}${len > 1 ? `${len > 2 ? "," : ""} ${conj} ` : ""
                }${arr.slice(-1)}`;
        };

        this.delay = function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        };

        this.hastebin = async function hastebin(text) {
            const { body } = await snek
                .post("https://hasteb.in/documents")
                .send(text);
            return `https://hasteb.in/${body.key}`;
        };

        this.randomNumber = function randomNumber(array) {
            return Math.floor(Math.random() * array.length);
        };

        this.truncate = function truncate(str) {
            return str.length > 2044 ? `${str.substring(0, 2044)}...` : str
        }

        this.chunk = function chunk(array, chunkSize) {
            let temp = [];
            for (let i = 0; i < array.length; i += chunkSize) {
                temp.push(array.slice(i, i + chunkSize));
            }
            return temp;
        };

        this.chunkString = function chunkString(str, size) {
            const numChunks = Math.ceil(str.length / size)
            const chunks = [numChunks]

            for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
                chunks[i] = str.substr(o, size)
            }

            return chunks
        }

        this.timeString = function timeString(seconds, forceHours = false) {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            if (isNaN(seconds) === false) {
                return `${forceHours || hours >= 1 ? `${hours}:` : ""}${hours >= 1 ? `0${minutes}`.slice(-2) : minutes
                    }:${`0${Math.floor(seconds % 60)}`.slice(-2)}`;
            } else {
                return `LIVE`;
            }
        };

        this.formatNumber = function formatNumber(number) {
            return Number.parseFloat(number).toLocaleString(undefined, {
                maximumFractionDigits: 2
            });
        };

        this.parseDur = function parseDur(ms) {
            let seconds = ms / 1000;
            let days = parseInt(seconds / 86400);
            seconds = seconds % 86400;
            let hours = parseInt(seconds / 3600);
            seconds = seconds % 3600;
            let minutes = parseInt(seconds / 60);
            seconds = parseInt(seconds % 60);

            if (days) {
                return `${days} day, ${hours} hours, ${minutes} minutes`;
            } else if (hours) {
                return `${hours} hours, ${minutes} minutes, ${seconds} seconds`;
            } else if (minutes) {
                return `${minutes} minutes, ${seconds} seconds`;
            }
            return `${seconds} seconds`;
        };

        this.trimArray = function trimArray(arr, maxLen = 10) {
            if (arr.length > maxLen) {
                const len = arr.length - maxLen;
                arr = arr.slice(0, maxLen);
                arr.push(`${len} more...`);
            }
            return arr;
        };

        this.decodeHtmlEntities = function decodeHtmlEntities(text) {
            return text.replace(/&#(\d+);/g, (rep, code) => {
                return String.fromCharCode(code);
            });
        };

        this.getUserBannerURL = async function (client, userId, { dynamicFormat = true, defaultFormat = "webp", size = 512 } = {}) {
            // Supported image sizes, inspired by 'https://discord.js.org/#/docs/main/stable/typedef/ImageURLOptions'.
            if (![16, 32, 64, 128, 256, 512, 1024, 2048, 4096].includes(size)) {
                throw new Error(`The size '${size}' is not supported!`);
            }

            // We don't support gif as a default format,
            // because requesting .gif format when the original image is not a gif,
            // would result in an error 415 Unsupported Media Type.
            // If you want gif support, enable dynamicFormat, .gif will be used when is it available.
            if (!["webp", "png", "jpg", "jpeg"].includes(defaultFormat)) {
                throw new Error(`The format '${defaultFormat}' is not supported as a default format!`);
            }

            // We use raw API request to get the User object from Discord API,
            // since the discord.js v12's one doens't support .banner property.
            const user = await client.api.users(userId).get();
            if (!user.banner) return null;

            const query = `?size=${size}`;
            const baseUrl = `https://cdn.discordapp.com/banners/${userId}/${user.banner}`;

            // If dynamic format is enabled we perform a HTTP HEAD request,
            // so we can use the content-type header to determine,
            // if the image is a gif or not.
            if (dynamicFormat) {
                const { headers } = await axios.head(baseUrl);
                if (headers && headers.hasOwnProperty("content-type")) {
                    return baseUrl + (headers["content-type"] == "image/gif" ? ".gif" : `.${defaultFormat}`) + query;
                }
            }
            console.log(baseUrl + `.${defaultFormat}` + query);
            return baseUrl + `.${defaultFormat}` + query;
        }

        this.unloadCommand = (location) => {
            try {
                delete require.cache[require.resolve(location)];
                return true;
            } catch (e) {
                return false;
            }
        }

        this.isJSON = (str) => {
            try {
                const parse = JSON.parse(str);
                return (parse && typeof parse === "object") || typeof parse === "boolean" || typeof parse === "number" || typeof parse === "string";
            } catch (e) {
                return false;
            }
        }

        this.escapeManyLines = (str) => {
            return str.replace(/(\r\n|\n|\r)/gm, "");
        }
    }
}

module.exports = Util;