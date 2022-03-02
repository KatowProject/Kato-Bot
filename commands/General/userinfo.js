const Discord = require('discord.js');
const moment = require('moment');

exports.run = async (client, message, args) => {
  let user = message.mentions.users.first() || message.author || messsage.guild.members.cache.get(args[0])

  if (user.presence.status === "dnd") user.presence.status = "Do Not Disturb";
  if (user.presence.status === "idle") user.presence.status = "Idle";
  if (user.presence.status === "offline") user.presence.status = "Offline";
  if (user.presence.status === "online") user.presence.status = "Online";

  function game() {
    let game;
    if (user.presence.activities.length >= 1) game = `${user.presence.activities[0].type} ${user.presence.activities[0].name}`;
    else if (user.presence.activities.length < 1) game = "None"
    return game;
  }

  let x = Date.now() - user.createdAt;
  let y = Date.now() - message.guild.members.cache.get(user.id).joinedAt;
  let created = Math.floor(x / 86400000);
  let joined = Math.floor(y / 86400000);

  const member = message.guild.member(user);
  let nickname = member.nickname !== undefined && member.nickname !== null ? member.nickname : "None";
  let createdate = moment.utc(user.createdAt).format("dddd, MMMM Do YYYY, HH:mm:ss");
  let joindate = moment.utc(member.joinedAt).format("dddd, MMMM Do YYYY, HH:mm:ss");
  let status = user.presence.status;
  let avatar = user.avatarURL({ size: 4096 });

  const embed = new Discord.MessageEmbed()
    .setAuthor(user.tag, avatar)
    .setThumbnail(avatar)
    .setTimestamp()
    .setColor(client.warna.kato)
    .addField("ID", user.id, true)
    .addField("Nickname", nickname, true)
    .addField("Created Account Date", `${createdate} \nsince ${created} day(s) ago`, true)
    .addField("Joined Guild Date", `${joindate} \nsince ${joined} day(s) ago`, true)
    .addField("Status", status, true)
    .addField("Game", game(), true)

  message.channel.send(embed);
}

exports.conf = {
  aliases: ["user"],
  cooldown: 5
}

exports.help = {
  name: 'userinfo',
  description: 'Menampilkan informasi sebuah pengguna.',
  usage: 'userinfo [@user]',
  example: 'userinfo @ray#1337'
}