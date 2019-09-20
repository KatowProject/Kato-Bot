const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
let warns = JSON.parse(fs.readFileSync("./warning.json", "utf8"));

module.exports.run = async (bot, message, args) => {
    if(!message.member.hasPermission("MANAGE_MEMBERS")) return message.reply("Aku takbisa memperingatkannya!");
    let wUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0])
    if(!wUser) return message.reply("Aku takbisa menemukan user tersebut.");
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("Aduh ... Bagaimana ini?");
    let reason = args.join(" ").slice(22);

    if(!warns[wUser.id]) warns[wUser.id] = {
        warns : 0
    };

    warns[wUser.id].warns++;

    fs.writeFile("./warning.json", JSON.stringify(warns), (err) => {
        if (err) console.log(err)
    });

    let warnEmbed = new Discord.RichEmbed()
    .setAuthor(message.author.username)
    .setColor("RANDOM")
    .addField("User yang diperingatkan", `<@${wUser.id}>`)
    .addField("Kanal", message.channel)
    .addField("Tingkat Peringatan", warns[wUser.id].warns)
    .addField("Alasan", reason);

    let warnchannel = message.guild.channels.find(`name`, "laporan");
    if(!warnchannel) return message.reply("Kanal tersebut tidak bisa ditemukan.");

    warnchannel.send(warnEmbed);

    if(warns[wUser.id].warns == 2){
        let muterole = message.guild.roles.find(`name`, `Muted`);
        if(!muterole) return message.reply("role tersebut tidak ditemukan.");

        let mutetime = "24h";
        await(wUser.addRole(muterole.id));
        message.channel.send(`Peringatan kedua! <@${wUser.id}>, akan kututup mulutmu selama seharian!`);

        setTimeout(function(){
            wUser.removeRole(muterole.id)
            message.reply(`<@${wUser.id}>, aku harap menyesal dengan perbuatanmu itu!`);
        }, ms(mutetime))
    }

    if(warns[wUser.id].warns == 3){
        message.guild.member(wUser.id).band(reason);
        message.reply(`<@${wUser.id}> sudah ku pukul! Ternyata dia tidak menyesal.`);
    }
}

module.exports.help = {
    name : "warn"
}