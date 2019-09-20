const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
// Jika Si Member Tidak Mempunyai Akses 
if (!message.member.hasPermission("SEND_MESSAGES")) return message.reply("Aku takbisa menmberikan yang kauinginkan. Maaf, ya ...");
let santai = message.guild.roles.find(r => r.name === "Santai");

message.member.addRole(santai.id).then(() => {
    message.delete();
    message.author.send(`Selamat Role ${santai.name} Telah Terpasang`);
});

};
module.exports.help = {
    name: "santai"
}