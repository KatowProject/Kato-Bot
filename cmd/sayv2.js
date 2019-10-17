// NPM Package = discord.js
const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
 let string_message = args.slice(0).join(" ");
 if (string_message == "") string_message = "Tidak ada keterangan."; 

 if (string_message) {   
  
  // Last Message ID
   let lastMessage_author = message.author.lastMessageID;
  // Get Last Message ID
   let message_id = message.channel.messages.get(`${lastMessage_author}`);
  // Attachment ID
   let get_attachmentsID = message_id.attachments.map(file => file.id);
  // Get Attachment ID
  let attachments_id = message_id.attachments.get(`${get_attachmentsID}`);
  // URL Images
  let hasil = `${attachments_id.url}`;
   message.delete().catch(O_o=>{});

  // Attach an image
   message.channel.send(`${string_message}`, {files: [`${hasil}`]});
};

}

module.exports.help = {
    name: "say"
}
