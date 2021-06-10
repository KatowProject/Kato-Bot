const Discord = require('discord.js');
const { log, elm } = require('../../database');
exports.run = async (client, message, args) => {
  try {

    if (!message.guild.me.hasPermission("MUTE_MEMBERS")) return message.channel.send("Aku tidak mempunyai akses!");

    let elms = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!elms) return;

    let reason = args.slice(1).join(" ");
    if (!reason) reason = "tidak ada alasan";

    //simpen data
    elm.set(message.author.id, elms._roles);
    console.log('sudah masuk ke db')

    //copot role
    for (const role of elms._roles) {
      elms.roles.remove(role);
    }

    //pasang role
    let berimute = message.guild.roles.cache.find(r => r.name === "ELM");
    await elms.roles.add(berimute).then(() => {
      message.delete()
      message.channel.send(`**${elms.user.tag}** telah selesai di ELM.\nAlasan : ${reason}`)
    })


    message.guild.channels.cache.find(c => c.name === "ruang-bk").send(`Hai **${elms}**, Selamat datang di <#699485344751681550>, member yang hanya bisa melihat channel ini artinya sedang dalam hukuman karena telah melanggar sesuatu. Jika anda merasa pernah melakukan sesuatu yang melanggar rules, silahkan beritahu disini agar segera diproses oleh staff dan dapat melanjukan kembali aktivitas chat secara normal.`);

    const embed = new Discord.MessageEmbed()
      .setAuthor(`ELM | ${elms.user.tag}`)
      .setColor(client.warna.kato)
      .addField("User", elms, true)
      .addField("Moderator", message.author, true)
      .addField("Alasan", reason, true)
      .setTimestamp()
      .setFooter(`${message.member.id}`, message.guild.iconURL);

    const getChannel = log.get(message.guild.id).elm;
    if (getChannel === 'null') return message.reply('Untuk mengaktifkan Log, Silahkan jalankan perintah k!logs').then(msg => msg.delete({ timeout: 5000 }));
    client.channels.cache.get(getChannel).send(embed);

  } catch (error) {
    return message.channel.send(`Something went wrong: ${error.message}`);
    // Restart the bot as usual.
  }
}

exports.conf = {
  aliases: ["jail", "kurung"],
  cooldown: 5,
  permissions: ['MUTE_MEMBERS']
}

exports.help = {
  name: 'elm',
  description: 'memberikan role ELM kepada user',
  usage: 'k!elm <user> [alasan]',
  example: 'k!elm @juned'
}