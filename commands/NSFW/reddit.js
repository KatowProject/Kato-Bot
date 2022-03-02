const cabulAPI = require("cabul");
const r = new cabulAPI.Client();

exports.run = async (client, message) => {

  if (!message.channel.nsfw) return;

  try {
    const rTags = [
      r.hentai(),
      r.ecchi(),
      r.netorare(),
      r.kemonomimi(),
      r.yuri(),
      r.thicc(),
      r.ahegao(),
      r.monster(),
      r.trap(),
      r.pantsu(),
      r.milf(),
      r.zettairyouiki(),
      r.nekomimi(),
      r.paizuri(),
      r.booty(),
      r.waifusgonewild(),
      r.gameovergirls(),
      r.armpits(),
    ];
    const random = rTags[Math.floor(Math.random() * rTags.length)];
    let randomCrot = await random;
    message.channel.send(
      `${randomCrot.url}\nSubreddit:${randomCrot.r}\n${randomCrot.rdesc}`
    );
  } catch (error) {
    return message.channel.send(`Something went wrong: ${error.message}`);
    // Restart the bot as usual.
  }
};

exports.conf = {
  aliases: ["r"],
  cooldown: 1,
};

exports.help = {
  name: "reddit",
  description: "Gets a random hentai from subreddits",
  usage: "k!reddit",
  example: "k!reddit",
  hide: true,
};
