const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
let string_message = args.slice(0).join(" ");
if (string_message) {
    message.delete().catch(O_o=>{});
    message.channel.send(string_message);
};

if (!string_message) {
    
    let lastMessage_author = message.author.lastMessageID;
    let message_id = message.channel.messages.get(`${lastMessage_author}`);
    let get_attachmentsID = message_id.attachments.map(file => file.id);
    let attachments_id = message_id.attachments.get(`${get_attachmentsID}`);
    let hasil = `${attachments_id.url}`;
    message.delete().catch(O_o=>{});
    const attachment = new Discord.Attachment(hasil);
    
    let channel = message.guild.channels.find("name", "event").send(attachment);
    let channel = message.guild.channels.find("name", "event").send(`Kiriman Dari ${nessage.author}`)
    message.channel.send("Gambar Telah Terkirim!")
};

}

module.exports.help = {
    name: "submit"
}
