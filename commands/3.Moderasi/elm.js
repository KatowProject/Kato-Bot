const Discord = require('discord.js');

exports.run = async (client, message, args) => {
  try {
    if (!message.member.hasPermission("MUTE_MEMBERS") || !message.guild.owner) return message.channel.send('Kamu tidak Mempunyai Akses!');
    if (!message.guild.me.hasPermission("MUTE_MEMBERS")) return message.channel.send("Aku tidak mempunyai akses!");

    let elm = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!elm) return message.channel.send("tag user yang ingin di elm!");

    let reason = args.slice(1).join(" ");
    if (!reason) reason = "tidak ada alasan";
    // buat copot role
    let copotsantai = message.guild.roles.cache.find(r => r.name === "Santai");
    await elm.roles.remove(copotsantai)

    let berimute = message.guild.roles.cache.find(r => r.name === "ELM");
    // buat copot role
    await elm.roles.add(berimute).then(() => {
      message.delete()
      message.channel.send(`**${elm.user.tag}** telah selesai di ELM.\n Alasan : ${reason}`)
    })

    let embed = new Discord.MessageEmbed()
      .setAuthor(`ELM | ${elm.user.tag}`)
      .setColor(client.warna.kato)
      .addField("User", elm, true)
      .addField("Moderator", message.author, true)
      .addField("Alasan", reason, true)
      .setTimestamp()
      .setFooter(`${message.member.id}`, message.guild.iconURL);

    client.channels.cache.get("438330646537044013").send(embed);

    message.guild.channels.cache.find(c => c.name === "ruang-bk").send(`Hai **${elm}**, Selamat datang di <#699485344751681550>, member yang hanya bisa melihat channel ini artinya sedang dalam hukuman karena telah melanggar sesuatu. Jika anda merasa pernah melakukan sesuatu yang melanggar rules, silahkan beritahu disini agar segera diproses oleh staff dan dapat melanjukan kembali aktivitas chat secara normal.`);
  } catch (error) {
    return message.channel.send(`Something went wrong: ${error.message}`);
    // Restart the bot as usual.
  }
}

exports.conf = {
  aliases: ["jail", "kurung"],
  cooldown: 5
}

exports.help = {
  name: 'elm',
  description: 'memberikan role ELM kepada user',
  usage: 'k!elm <user> [alasan]',
  example: 'k!elm @juned'
}