const AFK = require("../../database/schemas/afk");

exports.run = async (client, message, args) => {
  try {
    const afk = await AFK.findOne({ userID: message.author.id });
    const member = message.guild.members.cache.get(message.author.id);
    const me = message.guild.members.cache.get(client.user.id);

    //ignore AFK
    let reason = args.join(" ");

    if (!afk) {
      const nickname = member.nickname ? member.nickname : member.user.username;

      const memberRolePosition = member.roles.highest.rawPosition;
      const meRolePosition = me.roles.highest.rawPosition;
      message.channel.send({
        content: `**${message.author.tag}** telah AFK!\n**Alasan:** ${
          reason ? reason : "AFK"
        }`,
        allowedMentions: { parse: ["roles"] },
      });

      setTimeout(async () => {
        const data = { reason: reason ? reason : "AFK", time: Date.now() };
        await AFK.create({
          userID: message.author.id,
          data: JSON.stringify(data),
        });
      }, 7000);

      if (
        (memberRolePosition > meRolePosition) &
        !me.permissions.has("MANAGE_NICKNAMES")
      )
        return;
      if (nickname.length < 26) member.setNickname(`[AFK] ${nickname}`);
    } else {
      await AFK.findOneAndDelete({ userID: message.author.id });
    }
  } catch (error) {
    console.log(error);
    return message.channel.send(`Something went wrong: ${error.message}`);
    // Restart the bot as usual.
  }
};

exports.conf = {
  aliases: ["away"],
  cooldown: 10,
};

exports.help = {
  name: "afk",
  description: "menambahkan status afk pada user",
  usage: "afk [alasan]",
  example: "afk lagi makan",
};
