const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

    // Jika Si Member Tidak Mempunyai Akses 
    if (!message.member.hasPermission("MANAGE_ROLES")) return message.reply("Aku takbisa menmberikan yang kauinginkan. Maaf, ya ...");
    let membernya = message.guild.member(message.mentions.users.first());
    
    // Jika Si Pengguna Tidak Mention
    if (!membernya) return message.reply("Aku takbisa menemukan user itu.");
  
    let rolenya = args.slice(1).join(' ');
    if (!rolenya) return message.reply("Tolong beritahu secara lengkap role yang ingin lepas!");
  
    let role = message.guild.roles.find("name", rolenya);
    if (!role) return message.reply("Aku tak menemukan role tersebut.");
  
    // message.member.roles.has(adminRole.id)
  
    await membernya.removeRole(role.id);
  
    try {
    await message.channel.send(` Role ${role.name} sudah terlepas.`)
    }
    catch (e) {
        message.channel.send(`Role ${role.name} sudah terlepas untuk <@${membernya.id}>. Tapi, saat kami mencoba mengirim pesan intim, mereka menguncinya.`)
    };
      
}

module.exports.help = {
    name: "removerole"
}