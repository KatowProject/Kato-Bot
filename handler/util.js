const snek = require("node-superfetch");
const request = require("node-superfetch");
const discord = require('discord.js')

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

    this.sendBass = async function sendBass(bot, guild, gain, band) {
      if (!bot || !guild || !gain || !band) throw Error("Missing Parameter");
      try {
        let ws = await bot.player.nodes.first().send({
          op: "equalizer",
          guildId: guild,
          bands: [
            {
              band: band,
              gain: gain
            }
          ]
        });
        return true;
      } catch (e) {
        return true;
      }
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

    this.durasi = function durasi(ms) {

      let waktu = (ms * 10)
      const res = {
        detik: parseInt((waktu / 1000) % 60),
        menit: parseInt((waktu / (1000 * 60)) % 60),
        jam: parseInt((waktu / (1000 * 60 * 60)))
      }
      let jam = res.jam;
      waktu = waktu % (1000 * 60 * 60);
      let menit = res.menit
      waktu = (waktu % (1000 * 60)) % 60;
      let detik = res.detik
      waktu = (waktu % 1000) % 60

      if (jam) {
        return `${jam} jam ${menit} menit ${detik} detik`
      } else
        if (menit) {
          return `${menit} menit ${detik} detik`
        }

      return `${detik} detik`

    };

    this.splitEmbedDescription = function splitEmbedDescription(text, char = '') {
      let chunks = discord.Util.splitMessage(text, {
        char,
        maxLength: 2048
      })
      return chunks
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

    this.trimArray = function trimArray(arr, maxLen = 10) {
      if (arr.length > maxLen) {
        const len = arr.length - maxLen;
        arr = arr.slice(0, maxLen);
        arr.push(`${len} more...`);
      }
      return arr;
    };

    this.silhouette = function silhouette(ctx, x, y, width, height) {
      const data = ctx.getImageData(x, y, width, height);
      for (let i = 0; i < data.data.length; i += 4) {
        data.data[i] = 0;
        data.data[i + 1] = 0;
        data.data[i + 2] = 0;
      }
      ctx.putImageData(data, x, y);
      return ctx;
    };
    this.decodeHtmlEntities = function decodeHtmlEntities(text) {
      return text.replace(/&#(\d+);/g, (rep, code) => {
        return String.fromCharCode(code);
      });
    };

    this.verify = async function verify(channel, user, time = 30000) {
      const yes = ["yes", "y", "ye", "yeah", "yup", "yea", "ya"];
      const no = [
        "no",
        "n",
        "nah",
        "nope",
        "nop",
        "enggak",
        "ngak",
        "nggak",
        "engga"
      ];

      const filter = res => {
        const value = res.content.toLowerCase();
        return (
          res.author.id === user.id &&
          (yes.includes(value) || no.includes(value))
        );
      };
      const verify = await channel.awaitMessages(filter, {
        max: 1,
        time
      });
      if (!verify.size) return 0;
      const choice = verify.first().content.toLowerCase();
      if (yes.includes(choice)) return true;
      if (no.includes(choice)) return false;
      return false;
    };

    this.getSongs = async function getSongs(node, query, type = "song") {
      const params = new URLSearchParams();
      params.append("identifier", query);

      let result;
      try {
        result = await request
          .get(
            `http://${node.host}:${node.port}/loadtracks?${params.toString()}`
          )
          .set("Authorization", node.password);
      } catch (e) {
        return e.message;
      }
      if (type === "song") {
        return result.body.tracks;
      } else if (type === "playlist") {
        return result.body.playlistInfo;
      }
    };

    this.getProgressBar = function (queue) {
      let duration = queue.songs[0].info.length;
      let percent = queue.player.state.position / duration;
      const num = Math.floor(percent * 12);

      if (num === 1) {
        return "●━━━━━━━━━━━━━";
      } else if (num === 2) {
        return "━●━━━━━━━━━━━━";
      } else if (num === 3) {
        return "━━●━━━━━━━━━━━";
      } else if (num === 4) {
        return "━━━●━━━━━━━━━━";
      } else if (num === 5) {
        return "━━━━●━━━━━━━━━";
      } else if (num === 6) {
        return "━━━━━●━━━━━━━━";
      } else if (num === 7) {
        return "━━━━━━●━━━━━━━";
      } else if (num === 8) {
        return "━━━━━━━●━━━━━━";
      } else if (num === 9) {
        return "━━━━━━━━━●━━━━";
      } else if (num === 10) {
        return "━━━━━━━━━━●━━━";
      } else if (num === 11) {
        return "━━━━━━━━━━━●━━";
      } else if (num === 12) {
        return "━━━━━━━━━━━━━●";
      } else {
        return "●━━━━━━━━━━━━━";
      }
    };

    this.getTime = function (queue) {
      let end = () => {
        let ms = queue.player.state.position;
        let seconds = ms / 1000;
        seconds = seconds % 86400;
        seconds = seconds % 3600;
        let minutes = parseInt(seconds / 60);
        seconds = parseInt(seconds % 60);
        return { minutes, seconds };
      };
      let current = () => {
        let ms = queue.songs[0].info.length;
        let seconds = ms / 1000;
        seconds = seconds % 86400;
        seconds = seconds % 3600;
        let minutes = parseInt(seconds / 60);
        seconds = parseInt(seconds % 60);
        return { minutes, seconds };
      };
      const curentDurationMinute =
        end().minutes < 10 ? `0${end().minutes}` : end().minutes;
      const currentDurationSeconds =
        end().seconds < 10 ? `0${end().seconds}` : end().seconds;
      const endDurationMinute =
        current().minutes < 10 ? `0${current().minutes}` : current().minutes;
      const endDurationSeconds =
        current().seconds < 10 ? `0${current().seconds}` : current().seconds;
      return `${curentDurationMinute}:${currentDurationSeconds}/${endDurationMinute}:${endDurationSeconds}`;
    };

  }
}

module.exports = Util;