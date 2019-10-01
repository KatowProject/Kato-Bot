const Discord = require("discord.js");
const ms = require("ms");
module.exports.run = async (client, message, args) => {
 
  if (!message.member.hasPermissions("MANAGE_ROLES") || !message.guild.owner) return message.channel.send('Kamu tidak Mempunyai Akses!');
  if (!message.guild.me.hasPermissions(["MANAGE_ROLES", "ADMINISTRATOR"])) return message.channel.send("Aku tidak mempunyai akses!");
  let mutee = message.mentions.members.first() || message.guild.members.get(args[0]);
  if (!mutee) return message.channel.send("Tag user yang ingin di mute!");
 
  let reason = args.slice(2).join(" ");
  if (!reason) reason = "tidak diberi alasan";
 
  let muterole = message.guild.roles.find(r => r.name === "Muted");
 
  if (!muterole) {
    try{
      muterole = await message.guild.createRole({
        name: "Muted",
        color: "#000000",
        permissions:[]
      })
      message.guild.channels.forEach(async (channel, id) => {
        await channel.overwritePermissions(muterole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false
        });
      });
    } catch(e) {
      console.log(e.stack);
    }
  };
 
  let mutetime = args[1];
  if(!mutetime) return message.reply("Berikan durasi untuk melanjutkannya!");
 
  await(mutee.addRole(muterole.id));
  try {
    await message.channel.send(`Selamat! Role ${muterole.name} sudah terpasang.`)
    }
    catch (e) {
        message.channel.send(`Selamat! Role ${muterole.name} sudah terpasang untuk <@${mutee.id}>. Tapi, saat kami mencoba mengirim pesan intim, mereka menguncinya.`)
    };
 
  let embed = new Discord.RichEmbed()
    .setTitle(`Mute | ${mutee.user.username}#${mutee.user.discriminator}`)
    .setColor("#000000")
    .addField("User", mutee , true)
    .addField("Moderator", message.atuhor, true)
    .addField("Durasi", mutetime)
    .addField("Alasan", reason)
    .setTimestamp();
 

    

  let channel = message.guild.channels.find(c => c.name === "mod-logs");
  if(!channel) return message.reply("Please create a incidents channel first!");
  channel.send(embed);
 
  setTimeout(() => {
  mutee.removeRole(muterole);
  }, ms(mutetime));
}
 
module.exports.help = {
  name: "tempmute"
}
